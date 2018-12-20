/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
let auth = firebase.auth();
let db = firebase.database();

// function for navbar

function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

// function for create account

function signup() {
    let user = document.getElementById("username");
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    auth.createUserWithEmailAndPassword(email.value, password.value).then((snapshot) => {
        console.log(snapshot);
        let userObj = {
            userName: user.value,
            email: email.value,
            uid: snapshot.user.uid,
            password: password.value
        };

        db.ref().child(`users/${userObj.uid}`).set(userObj).then(() => {
            swal({
                title: "Acount Created Sucessfully",
                // text: "You clicked the button!",
                icon: "success",
            });

            setTimeout(() => {
                location.href = "login.html";
            }, 1000);

        })

    })
        .catch((e) => {
            swal({
                title: e,
                // text: "You clicked the button!",
                icon: "warning",
            });
        })

}

// login function

function login() {
    let userEmail = document.getElementById('UserEmail');
    let userPassword = document.getElementById('Userpassword');

    auth.signInWithEmailAndPassword(userEmail.value, userPassword.value).then(() => {

        swal({
            title: 'Sucessfully logged in',
            // text: "You clicked the button!",
            icon: "success",
        });

        setTimeout(() => {
            location.href = 'index.html';
        }, 1000)

    }).catch((e) => {
        swal({
            title: e,
            icon: "error",
        });
    })
}


function logout() {
    auth.signOut().then(() => {
        swal({
            title: 'Sucesfully logged out',
            icon: "success",
        })
        setTimeout(() => {
            location.href = 'index.html';
        }, 1000)
    })

}

function uploadImage() {
    var storageRef = firebase.storage().ref();
    var imagesRef = storageRef.child('images/ads_' + Math.random().toString().substring(2, 6) + '.jpg');
    var file = document.getElementById('upload').files[0] // use the Blob or File API

    return new Promise((resolve, reject) => {
        imagesRef.put(file)
            .then(function (snapshot) {
                imagesRef.getDownloadURL().then(function (url) {
                    // console.log('URL *****', url)
                    resolve(url);
                }).catch(function (error) {
                    // Handle any errors
                });
            }).catch((e) => {
                console.log(e)
            });
    })
}

function postData() {

    let category = document.getElementById('category')
    let yourname = document.getElementById("yourname");
    let title = document.getElementById("title");
    let model = document.getElementById("model");
    let description = document.getElementById("description");

    if (yourname.value == '' || title.value == '' || model.value == '' || description.value == '') {
        swal({
            title: 'Please fill the all the required fields',
            icon: "warning",
        })
    }
    else {
        uploadImage().then((url) => {
            let dataObj = {
                category: category.value,
                name: yourname.value,
                AdTitle: title.value,
                model: model.value,
                description:description.value,
                image: url
            };

            db.ref().child(`All`).push(dataObj).then(() => {
                swal({
                    title: 'Ad posted Sucessfully',
                    icon: "success",
                })
                setTimeout(() => {
                    location.href = 'index.html';
                }, 1000)

            })
        })
    }

}

function GetData() {
    let arrayUser = [];

    db.ref().child(`All`).once('value').then((snapshot) => {
        // console.log(snapshot.val());
        let data = snapshot.val();

        for (let key in data) {
            data[key].Adkey = key;
            arrayUser.push(data[key]);
        }

        for (let arr of arrayUser) {
            document.getElementById('getData').innerHTML += `<div class="card" style="width: 18rem; margin:6px;" >
            <img class="card-img-top" src="${arr.image}" alt="Card image cap">
            <div class="card-body myCardBody">
            <h5>AD Posted By : ${arr.name}
              <h5>Title: ${arr.AdTitle}</h5>
             
             Category: ${arr.category}
             <p class="card-text">Discription:<p>${arr.description}</p>
             Model:${arr.model} <spam><i class="fa fa-thumbs-o-up" style="font-size:24px" onclick="thumbsUp();" id="Adkey"></i> </spam>
             

             
              </p>
            </div>
          </div>`;

        }
    })

}

function thumbsUp(){
    auth.onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
 
let variety=document.getElementById("Adkey").style.backgroundColor="blue" ;

swal({
    title: 'Ad posted Sucessfully',
    icon: "success",
})


setTimeout  (()=>{

location.href="favorite.html";
}),1000

        } 
        
        else {
          // No user is signed in.

          swal({
            title: 'Please login first',
            icon: "error",
        })
        }
      });



}



