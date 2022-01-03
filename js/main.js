 // Global Variables 
 var lastPage;
 var pageSize = 9;
 var clientKey = "FaVV5pi9ixTPtvnHGXTgmuJLcvC7ceN8IiJwfW2kHVU";
 var searchTerm = "";
 var searchInput = document.querySelector("#search-input");
 
 // Detect Enter key and fire a function that searches the query when the key is released
 searchInput.addEventListener("keyup", function(event){

    // used key because keyCode and which are being deprecated
     if (event.key === "Enter") {
         searchClick();
     }
 }); 

 // Create a function that brings up the list when the page first loads
 function firstLoad() {
     lastPage = 1;
     loadList();
     document.querySelector("#loadMoreBtn").style.display = "block";
 }

 // Create a function that clears the previously displayed list of random images when the user clicks the search button
 function searchClick() {

     var myContainer = document.querySelector("#my-container");

     // Remove and clear all the image containers(div) within the main container
     myContainer.querySelectorAll("div").forEach(n => n.remove());  

     // Grab the search term entered by the user
     searchTerm = document.querySelector("#search-input").value;

     // Load the list of images matching the search 
     loadSearchList();
     
     document.querySelector("#loadMoreBtn").style.display = "block";
 }

 // Create a function that will call the correct load function
 function loadMore() {

     // If the user entered something in the search bar
     if (searchTerm !== "") {
             
         // Load the search version
         loadSearchList();
     } 
     else {
         
         // Load the random version
         loadList();
     }
 }

 // Create a function that displays a list of random images
 function loadList(){

     // Show the spinner
     $("#spinner").addClass("img-loading");

     // Create a uri variable that holds api address with information about number of images per page and which page it is on
     var uri = "https://api.unsplash.com/photos/?client_id=" + clientKey + "&per_page=" + pageSize + "&page=" + lastPage;

     // Testing to see how uri looks like
     //console.log(uri);
     
     // Make an AJAX request
     $.ajax(uri)
     
         // Pass the data response from the server
         .done(function(result){

             // If success, do something with the data
             // We will have a result variable to work with when done fires 
             // Display the result set containing a list of images 
             addToContainer(result);

             // If the length of the result is equal to page size (number of images are equal to number items in the array from Unsplash API)
             if(result.length == pageSize){ 

                 // Increment the last page so that more results can be displayed
                 lastPage++;

                 // Show Load More button
                 document.querySelector("#loadMoreBtn").style.display = "block";
             } 
             else {
                 
                 // Hide the more button
                 document.querySelector("#loadMoreBtn").style.display = "none";
             }
         })
         .fail(function(xhr, status, error){

             // Give a message to users for any errors
             console.log("Error: " + xhr.status);
         })

         // This will fire after done or fail
         .always(function(){

             // Hide the spinner
             $("#spinner").removeClass("img-loading");
         });
 }

 // Create a function that displays a list of images matching the search term
 function loadSearchList(){

     // Show the spinner
     $("#spinner").addClass("img-loading");

     // Create a uri variable that holds api address including information about number of images, which page it is on, and search term entered by the user
     var uri = "https://api.unsplash.com/search/photos/?client_id=" + clientKey + "&per_page=" + pageSize + "&page=" + lastPage + "&query=" + searchTerm;

     // Testing to see how the address looks like 
     console.log(uri);

     // Make an AJAX request
     $.ajax(uri)

         // Pass the data response from the server
         .done(function(result){

             // If success, do something with the data
             // We will have a result variable to work with when done fires 
             console.log("Results: " + result.results);

             // Display the results of images that matches the search term
             addToContainer(result.results);

             // If the number of images is equal to page size
             if(result.results.length == pageSize){ 

                 // Increment the last page so that more results can be displayed
                 lastPage++;

                 // Show the more button
                 document.querySelector("#loadMoreBtn").style.display = "block";
             } 
             else {
                 
                 // Hide the more button
                 document.querySelector("#loadMoreBtn").style.display = "none";
             }
         })
         .fail(function(xhr, status, error){

             // Give a message to users for any errors
             console.log("Error: " + xhr.status);
         })

         // This will fire after done or fail
         .always(function(){

             // Hide the spinner
             $("#spinner").removeClass("img-loading");
         });
 }

 // Create a function that generates image cards
 function addToContainer(result){

     // Container that holds all images
     var myContainer = document.querySelector("#my-container");

     // Loop through the result dataset array
     for(let i=0; i < result.length; i++) {

         // Make the outer box by creating an element of the specified type (div element)
         var box = document.createElement("div");

         // Add class="image-container" to the div block we created above
         box.classList.add("img-container");

         // Make the image to be linked to the original photo URL on Unsplash 
         var imageLink = document.createElement("a");
         imageLink.href = result[i].links.html;

         // Open the link on a new tab
         imageLink.target = "_blank";
     
         // Create img tag using createElement
         var image = document.createElement("img");

         // Define image src location by grabbing its raw url 
         image.src = result[i].urls.regular;

         // Add img-size class to all img tags
         image.classList.add("img-size");

         // Add alt description for each image
         image.alt = result[i].alt_description;

         // Add the image tag to be inside the image link tag
         imageLink.appendChild(image);
         
         // Build feature div container that will hold other features
         var features = document.createElement("div");

         // Two classes are added as class to div container
         features.classList.add("feature-container", "is-flex");

         // Create a paragraph tag for user information
         var user = document.createElement("p");
         user.innerText = "@";
         
         // Make the username clickable by creating a link tag around it. It will direct the visitors to that user's profile page where they can browser other photos created by that user
         var userLink = document.createElement("a");
         userLink.href = result[i].user.links.html;
         userLink.innerText = result[i].user.username;
         userLink.target = "_blank";

         // Add that user profile link to user info paragraph
         user.appendChild(userLink);

         // Add the user information to feature container
         features.appendChild(user);

         // Create a link that will open up the image as a full screen on a new tab
         var fullScreenLink = document.createElement("a");
         fullScreenLink.href = result[i].urls.regular;
         fullScreenLink.target = "_blank";
         
         // Create an icon that will be used as a button for viewing image in full screen 
         var fullScreenIcon = document.createElement("img");
         fullScreenIcon.src = "img/full-screen.png";
         fullScreenIcon.classList.add("full-icon");

         // Add the full screen icon to the link tag so that it becomes clickable
         fullScreenLink.appendChild(fullScreenIcon);

         // Add the full screen button to feature container
         features.appendChild(fullScreenLink);

         // Insert image to the box by appending/ adding it as the last child of a node 
         box.appendChild(imageLink);

         // Insert features consisting of user profile link and full screen button to the image card container
         box.appendChild(features);
         
         // Add the box to the main container
         myContainer.appendChild(box);

     }
 }