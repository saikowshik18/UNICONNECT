const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

function kow(){
  var a = document.getElementById("a1").value;
  var b = document.getElementById("a2").value;
  var c = document.getElementById("a3").value;
  if(a!=null && b!=null && c!=null){
    alert("ACCOUNT SUCCESSFULLY CREATED");
  }


  

}