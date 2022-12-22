"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

// nav bar on click submit Story

function submitStoryNav(evt) {
  console.log("submitStoryNav", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}
$navSubmit.on("click", submitStoryNav);

function favoriteClickNav(evt) {
  console.debug("favoriteClickNav", evt);
  hidePageComponents();
  favList();
}
$body.on("click", "#nav-favorites", favoriteClickNav);

function ownStories(evt) {
  console.debug("ownStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $userStories.show();
}

$body.on("click", "#navMyStories", ownStories);
/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

function profileClickNav(evt) {
  console.debug("profileClickNav", evt);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", profileClickNav);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
