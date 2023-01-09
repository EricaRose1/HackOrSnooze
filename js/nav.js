"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  // console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}
$body.on("click", "#nav-all", navAllStories);

// nav bar on click submit Story

function navSubmitStoryClick(evt) {
  // console.log("submitStoryNav", evt);
  evt.preventDefault(); // evt
  hidePageComponents();
  $allStoriesList.show();
  $submitStory.show();
}
$navSubmit.on("click", navSubmitStoryClick);

function navFavoritesClick(evt) {
  // console.debug("navFavoritesClick", evt);
  evt.preventDefault(); // evt
  hidePageComponents();
  putFavoritesListOnPage();
}
$body.on("click", "#nav-favorites", navFavoritesClick);

function navMyStories(evt) {
  // console.debug("navMyStories", evt);
  evt.preventDefault(); // evt
  hidePageComponents();
  putUserStoriesOnPage();
  $myStories.show();
}
$body.on("click", "#nav-my-stories", navMyStories);

/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  // console.debug("navLoginClick", evt);
  evt.preventDefault(); // evt
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}
$navLogin.on("click", navLoginClick);

function navProfileClick(evt) {
  // console.debug("navProfileClick", evt);
  evt.preventDefault(); // evt
  hidePageComponents();
  $profile.show();
}
$navUserProfile.on("click", navProfileClick);
/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  // console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
