async function verifyUser() {
    const youtubeChannelId = 'UCgIzTPYitha6idOdrr7M8sQ';  // Your YouTube Channel ID
    const githubUsername = 'bytemait';                    // Your GitHub username
    const apiKey = 'AIzaSyAjWDLLocR74ow90zHetXu7bBJ1Dq8VUfo';                         // Replace with your actual YouTube API key

    try {
        // 1. YouTube Subscription Verification
        let youtubeResponse = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&key=${AIzaSyAjWDLLocR74ow90zHetXu7bBJ1Dq8VUfo}`, {
            headers: {
                'Authorization': `Bearer ${AIzaSyAjWDLLocR74ow90zHetXu7bBJ1Dq8VUfo}`,  // Authentication header
                'Accept': 'application/json',
            }
        });

        if (youtubeResponse.status === 403 || youtubeResponse.status === 401) {
            showError("YouTube API authentication failed. Ensure you are using the correct API key and permissions.");
            return;
        }

        let youtubeData = await youtubeResponse.json();
        if (!youtubeData.items || youtubeData.items.length === 0) {
            showError("Please subscribe to the YouTube channel to access the content.");
            return;
        }

        // 2. GitHub Follower Verification
        let githubResponse = await fetch(`https://api.github.com/users/${githubUsername}/followers`);
        let githubData = await githubResponse.json();
        
        // Assuming 'yourGitHubUsername' is the currently logged-in user you are checking for
        let isFollowing = githubData.some(follower => follower.login === 'yourGitHubUsername');
        if (!isFollowing) {
            showError("Please follow us on GitHub to unlock the content.");
            return;
        }

        // If both conditions pass, show the restricted content
        document.getElementById('restricted-content').style.display = 'block';
    } catch (error) {
        console.error('Error during verification:', error);
        showError('An error occurred during verification. Please try again later.');
    }
}

function showError(message) {
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.innerHTML = `<div class="modal-content"><p>${message}</p><button onclick="closeModal()">Close</button></div>`;
    document.body.appendChild(modal);
}

function closeModal() {
    document.querySelector('.error-modal').remove();
}

function loadGoogleAPI() {
    gapi.load('client:auth2', function() {
        gapi.auth2.init({
            client_id: '130788371355-76vfrgm81gje83boa1f36056hkfoi8s7.apps.googleusercontent.com'
        });
    });
}

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        .then(function() { 
            console.log("Sign-in successful");
        }, function(error) { 
            console.error("Error signing in", error);
        });
}

function checkSubscription() {
    gapi.client.youtube.subscriptions.list({
        part: 'snippet',
        mine: true
    }).then(function(response) {
        console.log(response.result.items); // Check if user is subscribed
    }, function(error) {
        console.error("YouTube API error", error);
    });
}
