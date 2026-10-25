// Read the username from the command line 
const username = process.argv[2];

if (!username) {
  console.log("Usage: github-activity <username>");
  process.exit(1);
}

// Fetch events from the GitHub API 
async function fetchEvents(user) {
  const url = `https://api.github.com/users/${user}/events`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "github-activity-cli", 
      Accept: "application/vnd.github+json",
    },
  });

  if (response.status === 404) {
    throw new Error(`User "${user}" not found.`);
  }
  if (response.status === 403) {
    throw new Error("API rate limit exceeded. Try again later.");
  }
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

// Convert one event into a readable line 
function describeEvent(event) {
  const repo = event.repo.name;
  const payload = event.payload;

  switch (event.type) {
    case "PushEvent": {
      const count = payload.commits?.length ?? payload.size ?? 1;
      return `Pushed ${count} commit${count === 1 ? "" : "s"} to ${repo}`;
    }
    case "IssuesEvent":
      return `${capitalize(payload.action)} an issue in ${repo}`;
    case "IssueCommentEvent":
      return `Commented on an issue in ${repo}`;
    case "PullRequestEvent":
      return `${capitalize(payload.action)} a pull request in ${repo}`;
    case "PullRequestReviewEvent":
      return `Reviewed a pull request in ${repo}`;
    case "WatchEvent":
      return `Starred ${repo}`;
    case "ForkEvent":
      return `Forked ${repo}`;
    case "CreateEvent":
      return `Created ${payload.ref_type} ${payload.ref ?? ""} in ${repo}`.replace("  ", " ");
    case "DeleteEvent":
      return `Deleted ${payload.ref_type} ${payload.ref ?? ""} in ${repo}`.replace("  ", " ");
    case "PublicEvent":
      return `Made ${repo} public`;
    default:
      return `${event.type.replace("Event", "")} in ${repo}`;
  }
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Main function 
async function main() {
  try {
    const events = await fetchEvents(username);

    if (events.length === 0) {
      console.log(`No recent public activity found for ${username}.`);
      return;
    }

    console.log(`Recent activity of ${username}:\n`);
    events.forEach((event) => {
      console.log(`- ${describeEvent(event)}`);
    });
  } catch (error) {
    if (error.cause?.code === "ENOTFOUND") {
      console.log("Network error: check your internet connection.");
    } else {
      console.log(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

main();