var numero1 = 20
var numero2 = 10
var numero3
var numero4
var campo1
var campo2
var button
var divContainer


numero3 = numero1 + numero2
numero4 = numero2 - numero1

console.log(numero3)
console.log(numero4)

button = window.document.querySelector("#btn-suma")
divContainer = window.document.querySelector("#contenedor")
console.log(divContainer)

buttonResta = window.document.querySelector("#btn-resta")

button.addEventListener("click",function(){
    campo1 = window.document.querySelector("#campo1").value;
    campo1 = parseInt(campo1);

    campo2 = window.document.querySelector("#campo2").value;
    campo2 = parseInt(campo2);

divContainer.innerHTML = "La suma de los dos numeros es :" + (campo1 + campo2) 

})
buttonResta.addEventListener("click",function(){
    campo1 = window.document.querySelector("#campo1").value;
    campo1 = parseInt(campo1);

    campo2 = window.document.querySelector("#campo2").value;
    campo2 = parseInt(campo2);

    divContainer.innerHTML = "la resta de los dos numeros es:" + (campo1 - campo2) 
})

