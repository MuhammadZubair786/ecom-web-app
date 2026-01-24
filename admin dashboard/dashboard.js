async function GetData(){
    var uid = localStorage.getItem("userUid")

    var stats_categories = document.getElementById("stats-categories")
    var stats_users = document.getElementById("stats-users")
    var stats_products = document.getElementById("stats-products")
    var stats_orders = document.getElementById("stats-orders")

    var loading = document.getElementById("loading")
    var stats_grid = document.getElementsByClassName("stats-grid")

    console.log(stats_grid[0])


    await firebase.database().ref("category").get().then((db)=>{
        console.log(db.val())
        var productlength = Object.values(db.val()).length
        console.log(productlength)
        stats_categories.innerText=productlength
    })
    .catch((Err)=>{
        console.log(Err)
    })

     await firebase.database().ref("Users").get().then((db)=>{
        console.log(db.val())
        var userlength = Object.values(db.val()).length
        console.log(userlength)
        stats_users.innerText=userlength
    })
    .catch((Err)=>{
        console.log(Err)
    })

    await firebase.database().ref("Products").get().then((db)=>{
        console.log(db.val())
        var userlength = Object.values(db.val()).length
        console.log(userlength)
        stats_products.innerText=userlength
    })
    .catch((Err)=>{
        console.log(Err)
    })

     await firebase.database().ref("Orders").get().then((db)=>{
        console.log(db.val())
        var orderLength = Object.values(db.val()).length
        console.log(Object.values(db.val()))
        console.log(orderLength)
        stats_orders.innerText=orderLength
    })
    .catch((Err)=>{
        console.log(Err)
    })


    loading.style.display="none"
    stats_grid[0].removeAttribute("style")
    // stats_grid[0].style.back
}

GetData()