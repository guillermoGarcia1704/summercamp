window.addEventListener("load",(name)=>{
    let button = document.querySelector("header button")
    let nav =document.querySelector("nav")
    let menuIcon = document.querySelector("header button img")
    // console.log(menuIcon);
    button.addEventListener("click", ()=>{
nav.classList.toggle("marginRight")

       if(nav.classList.contains("marginRight")){
        menuIcon.src = "img/close.png"
       
       }else{
        menuIcon.src = "img/menu.png"
       }
    })
});
