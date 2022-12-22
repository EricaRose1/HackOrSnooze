"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showBtn = false) {
  // console.debug("generateStoryMarkup", story);
  const showStar = Boolean(currentUser);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      ${showBtn ? deleteBtnHTML() : ""}
      ${showStar ? star(story, user) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

// Added delete button for html story
function deleteBtnHTML() {
  let button = (document.createElement("button").className = "delete");
  return button;
}

// Star for favorites
function star(story, user) {
  const isFav = user.isFav(story);
  const starType = isFav ? "y" : "n";
  return (document.createElement("div").className = `${starType}`);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// deleting Story event
async function deleteStory(evt) {
  const closestLi = document.querySelector(evt.target).closet("li");
  const storyId = closestLi.attr("id");
  await storyList.removeStory(currentUser, storyId);

  await pageStories();
}
$userStories.on("click", ".delete", deleteStory);

//new story form handler
async function submitNewStory(evt) {
  evt.preventDefault();

  const title = document.querySelector("#createTitle").value;
  const url = document.querySelector("#createUrl").value;
  const author = document.querySelector("createAuthor").value;
  const username = currentUser.username;
  const storyInfo = { title, url, author, username };

  const story = await storyList.addstory(currentUser, storyInfo);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  //RESET&HIDEFORM
  $submitForm.trigger("reset");
  $submitForm.slideUp("slow");
}

$submitForm.on("submit", submitNewStory);
// list of user own stories

function pageStories() {
  $ownStories.empty();
  if (currentUser.ownStories.length === 0) {
    $ownStories.append("No Stories!");
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

// fav list functionality

function favList() {
  $favStories.empty();
  if (currentUser.favorites.length === 0) {
    $favStories.append("No Favorites Saved");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favStories.append($story);
    }
  }
  $favStories.show();
}

async function toggleFavStory(evt) {
  const tgt = document.querySelector(evt.target);
  const closestLi = tgt.closest("li");
  const storyId = closestLi.attr("id");
  const story = storyList.stories.querySelector(S > s.storyId === storyId);
  if (tgt.classList.contains("y")) {
    await currentUser.removeFavorite(story);
    tgt.closest("i").classList.toggle("y n");
  } else {
    await currentUser.addFavorite(story);
    tgt.closest("i").classList.toggle("y n");
  }
}

storiesList.on("click", ".star", toggleFavStory);
