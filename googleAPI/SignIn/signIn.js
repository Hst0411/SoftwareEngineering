function onSignIn(googleUser)
{
    var profile = googleUser.getBasicProfile();
    $(".g-signin2").css("display", "none");
    //window.open = ("");
    console.log(googleUser);
    window.location.href = ("http://localhost:8080/home.html");
}