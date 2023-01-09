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

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn ? getDeleteBtnHTML() : ""}
      ${showStar ? getStarHTML(story, currentUser) : ""}
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
function getDeleteBtnHTML() {
  return `<span class="trash-can">
  <i class="fas fa-trash-alt"></i>
</span>`;
}

// Star for favorites
function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `<span class="star">
  <i class=" ${starType} fa-star"></i>
</span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  // console.debug("putStoriesOnPage");
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

// deleting Story event
async function deleteStory(e) {
  // console.debug("deleteStory");

  const $closestLi = $(e.target).closest("li");
  const storyId = $closestLi.attr("id");
  await storyList.removeStory(currentUser, storyId);

  await putUserStoriesOnPage();
}
$userStories.on("click", ".trash-can", deleteStory);

//new story form handler
async function submitNewStory(evt) {
  // console.debug("submitNewStory");
  evt.preventDefault();

  const title = $(".create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username;
  const storyInfo = { title, url, author, username };

  const story = await storyList.addStory(currentUser, storyInfo);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  //RESET&HIDE FORM
  $submitStory.trigger("reset");
  $submitStory.slideUp("slow");
}

$submitStory.on("submit", submitNewStory);
// list of user own stories

function putUserStoriesOnPage() {
  $userStories.empty();
  if (currentUser.ownStories.length === 0) {
    $userStories.append("<h5>No Stories!</h5>");
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $userStories.append($story);
    }
  }
  $userStories.show();
}

// fav list functionality
function putFavoritesListOnPage() {
  // console.debug("putFavoritesListOnPage");

  $favStories.empty();

  if (currentUser.favorites.length === 0) {
    $favStories.append("<h5>No favorites added!</h5>");
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favStories.append($story);
    }
  }

  $favStories.show();
}

async function toggleStoryFavorite(evt) {
  // console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorites(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);
