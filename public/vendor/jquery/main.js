window.onload = () => {
    let search_params = new URLSearchParams(window.location.search)
    let searchId= ""
    if(search_params.has('id')){
        let getId = search_params.get('id')
        searchId = getId
    }
    let logout = document.getElementById("logout_button")
    if(logout !== undefined && logout !== null){
        logout.addEventListener('click',()=>{
           sessionStorage.userId = null 
           sessionStorage.token = null
           sessionStorage.user = null 
        })
    }

    let  validPassword= function(){
        let alertElement = document.getElementById("passcheck")
        let password0 = document.getElementById("password1").value;
        let passValue = this.value
        if(passValue !== password0){    
            alertElement.className = "text-white"
            return alertElement.innerHTML = "Passwords do not match"
        }else{
            alertElement.className = "text-white"
            return alertElement.innerHTML = "Password Match"            }
    }
    let locate = window.location.pathname
    let tokenStr = locate.split(":")
    let newToken 
    if(tokenStr[1] !== undefined){
        newToken =  tokenStr[1]
    }
    let token = ""
    let cartCount = document.getElementById('cartCount')
    let cartIt = sessionStorage.getItem("orderArray")
    let cartItm = JSON.parse(cartIt)
    let stat = sessionStorage.userId
    

    if (cartItm != null) {
        cartCount.innerHTML = cartItm.length
    } else {
        cartCount.innerHTML = ""
    }

    if(sessionStorage.user !== null){
        let navPic = document.getElementById("navPic")
        if(navPic !== null){
            let usr =sessionStorage.getItem("user")
            user = JSON.parse(usr)
            pic = user.profilepic
            navPic.src = pic
        }
    }

    if (locate == "/user/checkout") {
        let description = ""
        let totalCost = 0
        let paymentButton = document.getElementById('paymentButton')
        let cartItem = sessionStorage.getItem("orderArray")
        let cartItems = JSON.parse(cartItem)
        let table = document.createElement('table')

        let checkContainer = document.getElementById('tablebody')
        checkContainer.innerHTML = "<div class='d-flex justify-content-center'><div class='spinner-border  text-dark' role='status' style='width: 4rem; height:4rem;'> <span class='sr-only'>Loading .........</span></></div></div>"

        //adding table headers
        let thead = document.createElement('thead')
        let tablebody = document.createElement('tbody')
        let timage = document.createElement('th')
        let tname = document.createElement('th')
        let tquantity = document.createElement('th')
        let tremove = document.createElement('th')
        let tcost = document.createElement('th')

        //giving the created elements classes
        table.height = "100%"
        table.width = "100%"
        timage.className = "col-md-4"
        tname.className = "col-md-3"
        tquantity.className = "col-md-1"
        tcost.className = "col-md-2"
        tremove.className = "col-md-1"

        //giving values to the headers
        timage.innerHTML = "Image"
        tname.innerHTML = "Name"
        tquantity.innerHTML = "Quantity"
        tcost.innerHTML = "Cost"
        tremove.innerHTML = "Remove"
            //appending the headers to the table
        thead.appendChild(timage)
        thead.appendChild(tname)
        thead.appendChild(tquantity)
        thead.appendChild(tcost)
        thead.appendChild(tremove)
        table.appendChild(thead)
        table.appendChild(tablebody)
        table.className = "table-responsive table-stripped"

        let removeItem = function(event) {
            event.preventDefault()
            idArray = this.id.split(":")
            id = idArray[1]
            let Index = cartItems.findIndex((obj => obj.id === id));
            cartItems.splice(Index, 1)
            let element = document.getElementById(id)
            element.parentNode.removeChild(element)
            sessionStorage.setItem("orderArray", JSON.stringify(cartItems))
            window.location.assign("/user/checkout")
        }

        setTimeout(() => {
            checkContainer.innerHTML = ""
            if (cartItems == null) {
                return checkContainer.innerHTML = "No item in cart"
            }
            length = cartItems.length
            let itemDiv = document.createElement('div')
            let itemImg = document.createElement('img')
            let sumtotal = document.getElementById('Sumtotal')
            if (cartItems)
                for (i = 0; i < length; i++) {

                    description += " " + cartItems[i].quantity + " " + cartItems[i].name + " ,"
                    totalCost += parseInt(cartItems[i].finalCost)
                    let quantity = cartItems[i].quantity
                    let name = cartItems[i].name
                    let cost = cartItems[i].finalCost

                    //creating the html elements
                    let div = document.createElement('div')
                    let rembutton = document.createElement('i')
                    let itemDiv = document.createElement('div')
                    let itemImg = document.createElement('img')
                    let row = document.createElement('tr')
                    let quantdiv = document.createElement('td')
                    let namediv = document.createElement('td')
                    let imdiv = document.createElement('td')
                    let costdiv = document.createElement('td')
                    let removediv = document.createElement('td')

                    let br = document.createElement('br')

                    //styling the columns
                    itemImg.width = "100%"
                    itemImg.style.borderRadius = "12px"
                    itemImg.style
                    costdiv.className = "col-md-2"
                    namediv.className = "col-md-4"
                    quantdiv.className = "col-md-1"
                    imdiv.className = "col-md-3"
                    removediv.className = "col-md-2"
                    rembutton.className = "fa fa-times-circle"
                    rembutton.id = 'rem:' + cartItems[i].id
                    rembutton.addEventListener('click', removeItem)
                        //creating table headers
                        //adding th values
                    quantdiv.innerHTML = quantity
                    namediv.innerHTML = name
                    costdiv.innerHTML = cost
                    itemImg.src = cartItems[i].image
                    itemImg.className = "img-responsive"
                    imdiv.appendChild(itemImg)
                    row.appendChild(imdiv)
                    row.appendChild(namediv)
                    row.appendChild(quantdiv)
                    row.appendChild(costdiv)
                    removediv.appendChild(rembutton)
                    row.appendChild(removediv)
                    row.id = cartItems[i].id
                    tablebody.appendChild(row)
                    checkContainer.appendChild(table)
                }

            let paydesc = document.getElementById("paymentdesc")

            paydesc.innerHTML = description
            sumtotal.innerHTML = totalCost

        }, 2000)

        let paymentFunction = function(payclick) {
            payclick.preventDefault()
            let authToken = sessionStorage.token
            let payArray = []
            let formdat = new FormData()
            let deliverAddres = document.getElementById('deliveryAddress')
            let stateEl = document.getElementById('state')
            state = stateEl.value
            let phoneEl = document.getElementById('phonenumber')
            phoneNumber = phoneEl.value
            let deliverAddress = deliverAddres.value

            // formdat.append('order', cartItems)
            let cast = JSON.stringify(cartItm)
            let orderProId = []
            cartItm.forEach((item)=>{
            orderProId.push(item.id)
            })
            sessionStorage.setItem("productIds",orderProId)
            let orderData = {
                'author': authToken,
                'totalCost': totalCost,
                'order': cast,
                'deliveryAddress': deliverAddress,
                'phoneNumber': phoneNumber,
                'state': state
            }

            fetch('/user/order/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': authToken
                    },
                    body: JSON.stringify(orderData)
                })
                .then((res) => res.json())
                .then((data => {
                    if (data.message === "please Authenticate") {
                        let login_modal = document.getElementById('checkoutAlert')
                        login_modal.style.display = "block"
                    }
                    if(data.status ==="success"){
                        window.location.assign(`/user/payment/?id=${data.order._id}_${data.order.totalCost}`)
                    }
                }))
        }
        const loginCheck = (loginEvent) => {
            loginEvent.preventDefault();
            let email = document.forms["checkoutloginform"]["email"].value;
            let password = document.forms["checkoutloginform"]["password"].value;
            const userInfo = {
                email,
                password
            }
            try {
                fetch('/user/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userInfo)
                    })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.status == 'login successful') {
                            token = data.token
                            user = data.finduser
                            sessionStorage.userId = data.finduser._id
                            sessionStorage.token = JSON.stringify(token)
                            sessionStorage.user = JSON.stringify(user)
                            if (data.status == 'login successful') {
                                let login_modal = document.getElementById('checkoutAlert')
                                login_modal.innerHTML = "<h4 class='btn btn-primary'>Login Sucessfull ,proceed</h4>"
                                login_modal.style.display = "block"
                                return location.reload()
                            }

                        } else {
                            alertbtn = document.getElementById('alerbtn')
                            alertprompt= document.getElementById('alert_prompt')
                            alertbtn.innerHTML = "login unsucessfull check email and password"
                            return alertprompt.style.display = "block"
                        }
                    })
            } catch (error) {
            }
        }
        let checkoutlogin = document.getElementById('checklog').addEventListener('click', loginCheck)
        paymentButton.addEventListener('click', paymentFunction)


    }


    if (locate == "/") {

        let productContainer = document.getElementById('productcontainer')

        productContainer.innerHTML = "<div class='d-flex justify-content-center'><div class='spinner-border  text-dark' role='status' style='width: 8rem; height:8rem;'> <span class='sr-only'>Loading .........</span></div></div>"
        let orderArrays = sessionStorage.getItem("orderArray")
        let orderArray = JSON.parse(orderArrays)
        let orderCart = {}
        let prodName
        let prodImage
        let prodprice
        let details
        let final_cost
        let val1 = parseInt(document.getElementById('quant').value, 10)
        let orderAmount = document.getElementById('orderamount')

        let add = document.getElementById('plus').addEventListener('click', (e) => {

            e.preventDefault()
            let cost = parseInt(prodprice)
            val = val1
            val1 = isNaN(val1) ? 0 : val1
            val1++
            cost *= parseInt(val1)
            orderAmount.innerText = cost
            val1 = val1
            document.getElementById('quant').value = val1
            final_cost = orderAmount.innerHTML
        })
        let minus = document.getElementById('minus').addEventListener('click', function(e) {
            e.preventDefault()
            let cost = parseInt(prodprice)
            let val = parseInt(document.getElementById('quant').value, 10)
            val = isNaN(val1) ? 0 : val1
            val--
            cost *= parseInt(val)
            orderAmount.innerText = cost
            val1 = val
            document.getElementById('quant').value = val
            final_cost = orderAmount.innerHTML
        })
        let orderfn = function(ev) {
            let order_alert = document.getElementById('order-alert')
            let orderAlert = document.getElementById('orderalert')
            orderAlert.innerHTML = ""
            order_alert.style.display = "none"
            ev.preventDefault()
            val1 = 0
            let final_quantity
            let nameprice = this.id
            let namepriceArr = nameprice.split(":")
            let modalheader = document.getElementById('modalheader')
            prodImage = document.getElementById('prodimage')
            prodName = namepriceArr[0]
            prodprice = namepriceArr[1]
            image = namepriceArr[2]
            prodId = namepriceArr[3]

            prodImage.src = image
            modalheader.innerHTML = prodName
            orderAmount.innerText = prodprice
            details = this
        }

        let addToCart = document.getElementById('addtocart').addEventListener('click', function(e) {
            e.preventDefault()
                // JSON.parse(sessionStorage.cartItems)
            let finalCost = document.getElementById('orderamount').innerHTML
            let quantity = parseInt(document.getElementById('quant').value)

            orderCart = {
                'id': prodId,
                'name': prodName,
                'finalCost': finalCost,
                'image': image,
                'quantity': quantity
            }
            if (!orderArray) {
                orderArray = []
                orderArray.push(orderCart)
                cartCount.innerHTML = 1
                let order_alert = document.getElementById('order-alert')
                let orderAlert = document.getElementById('orderalert')
                orderAlert.innerHTML = orderCart.quantity + " " + orderCart.name + " " + "added to cart"
                order_alert.style.display = "block"
            } else {
                let objIndex = orderArray.findIndex((obj => obj.name == orderCart.name));
                if (objIndex != -1) {
                    orderArray[objIndex].finalCost = orderCart.finalCost
                    orderArray[objIndex].quantity = orderCart.quantity
                    let order_alert = document.getElementById('order-alert')
                    let orderAlert = document.getElementById('orderalert')
                    orderAlert.innerHTML = "Order updated sucessfully"
                    order_alert.style.display = "block"
                } else {
                    let order_alert = document.getElementById('order-alert')
                    let orderAlert = document.getElementById('orderalert')
                    orderArray.push(orderCart)
                    cartCount.innerHTML = orderArray.length
                    orderAlert.innerHTML = "Item added to cart"
                    order_alert.style.display = "block"
                }
            }
            let redirectToCheckout = function() {
                sessionStorage.setItem("orderArray", JSON.stringify(orderArray))
                window.location.assign("/user/checkout")
            }
            let check = document.getElementById('checkout').addEventListener('click', redirectToCheckout)
        })
        fetch('/user/getproducts')
            .then((resp) => resp.json())
            .then((data) => {
                setTimeout(() => {
                    let prodcont = document.getElementById('productcontainer')
                    prodcont.innerHTML = ""
                    for (i = 0; i < data.length; i++) {
                        let imcont = document.createElement('div')
                        let cardcont = document.createElement('div')
                        let card = document.createElement('div')
                        let imgtag = document.createElement('img')
                        let cardbody = document.createElement('div')
                        let productname = document.createElement('h4')
                        let cost = document.createElement('h5')
                        let productdescription = document.createElement('p')
                        let orderbuttoncont = document.createElement('div')
                        let orderbutton = document.createElement('button')

                        cardcont.className = "col-md-3 mb-5"
                        imcont.className = "view overlay"
                        card.className = "card h-100"
                        imgtag.className = "card-img-top"
                        cardbody.className = "card-body"
                        productname.className = "card-title"
                        productdescription.className = "card-text"
                        orderbuttoncont.className = "card-footer"
                        orderbutton.className = "btn btn-primary"
                        imgtag.id = data[i]._id
                        imgtag.src = data[i].productImage
                        imgtag.alt = data[i].productName
                        imgtag.style.height = "200px"
                        productname.id = "productname"
                        productname.innerHTML = data[i].productName
                        productdescription.id = "productDescription"
                        productdescription.innerHTML = data[i].productDescription
                        orderbuttoncont.id = "orderbuttoncont"
                        orderbutton.innerHTML = "Order"
                        cost.innerHTML = "Price: " + data[i].price
                        orderbutton.href = "#"
                        orderbutton.id = data[i].productName + ":" + data[i].price + ":" + data[i].productImage + ":" + data[i]._id
                        orderbutton.dataset.toggle = "modal"
                        orderbutton.dataset.target = "#myModal"
                        orderbutton.addEventListener('click', orderfn)

                        imcont.appendChild(imgtag)
                        card.appendChild(imcont)
                        cardbody.appendChild(productname)
                        cardbody.appendChild(productdescription)
                        card.appendChild(cardbody)
                        orderbuttoncont.appendChild(cost)
                        orderbuttoncont.appendChild(orderbutton)
                        card.appendChild(orderbuttoncont)
                        cardcont.appendChild(card)
                        prodcont.appendChild(cardcont)
                    }
                }, 2000)

            })
    }

   
    
    //}

    if (locate == "/user/dashboard/") {
        const id  = sessionStorage.userId
        const token = sessionStorage.token;
        const user = JSON.parse(sessionStorage.user)
        const profileImage = document.getElementById("profileimage")
        profileImage.src= user.profilepic

         fetch(`/user/getuserorder/${id}`)
        .then(resp=> resp.json())
        .then((data)=>{
            setTimeout(()=>{
                
            },2000)
            let tbody = document.getElementById('tablebody')
            let len = data.userOrders.length
            for (i = 0; i<len; i++) {
                sn =i
                let row = document.createElement('tr')
                row.id = 'row' + data.userOrders[i]._id
                let editbtn = document.createElement('button')
                editbtn.className = "fa fa-edit"
                let deletebtn = document.createElement('button')
                deletebtn.className = "fa fa-trash"
                let colnum = document.createElement('td')
                colnum.id = 'ordercol' + data.userOrders[i]._id
                let serial = document.createElement('td')
                let customer = document.createElement('td')
                let Paymentfor = document.createElement('td')
                let amount= document.createElement('td')
                let deliveryAddress = document.createElement('td')
                let state = document.createElement('td')
                let phoneNumber = document.createElement('td')
                let status = document.createElement('td')
                let paymentStatus = document.createElement('td')
                let order_Token = document.createElement('td')
                let transacition_date = document.createElement('td')


                customer.innerHTML = data.userOrders[i].author.fullname
                Paymentfor.innerHTML= data.userOrders[i].summary
                amount.innerHTML = data.userOrders[i].totalCost
                deliveryAddress.innerHTML = data.userOrders[i].deliveryAddress
                state.innerHTML = data.userOrders[i].state
                phoneNumber.innerHTML = data.userOrders[i].phoneNumber
                status.innerHTML = data.userOrders[i].status
                paymentStatus.innerHTML = data.userOrders[i].paymentStatus
                order_Token.innerHTML = data.userOrders[i].orderToken
                transacition_date.innerHTML = data.userOrders[i].date
                serial.innerHTML = sn


                row.appendChild(serial)
                row.appendChild(customer)
                row.appendChild(Paymentfor)
                row.appendChild(amount)
                row.appendChild(deliveryAddress)
                row.appendChild(state)
                row.appendChild(phoneNumber)
                row.appendChild(status)
                row.appendChild(paymentStatus)
                row.appendChild(order_Token)
                row.appendChild(transacition_date)
                tbody.appendChild(row)
            }
        })

//getting the user posts
        fetch(`/user/getuserposts/${id}`).then((resp)=> resp.json())
        .then((data)=>{
            let post_rev = document.getElementById('userpost')
            for (i = 0; i < data.length; i++) {
                let anchor = document.createElement('a')
                let anchor2 = document.createElement('a')
                let hr = document.createElement('br')
                let br = document.createElement('hr')
                br.style.height = "2px"
                br.style.backgroundColor = "grey"
                br.style.marginBottom = "20px"
                let par = document.createElement('p')
                par.className = "post-meta"
                let h2 = document.createElement('h4')
                h2.className = "post-title"
                let h3 = document.createElement('h4')
                let dat = document.createElement('span')
                h3.className = "post-subtitle"
                h2.innerHTML = data[i].title
                h3.innerHTML = data[i].content
                anchor.href = "/user/singlepost/" + data[i]._id
                anchor.appendChild(h2)
                anchor.appendChild(h3)
                par.innerHTML = "posted by "
                anchor2.innerHTML = data[i].author.fullname + " " + " on" + " " + data[i].date
                dat.innerHTML = data[i].date
                    // anchor2.appendChild(dat)
                par.appendChild(anchor2)
                post_rev.appendChild(anchor)
                post_rev.appendChild(par)
                post_rev.append(br)

            }


            
        })


        let uploadImage = function(e){
           e.preventDefault()
           let image = document.getElementById('profilepic').files[0]
           let formdata = new FormData()
           formdata.append('profilepic',image)
           
           fetch(`/user/uploadprofilepic/:${id}`,{
               method: 'POST',
               headers: {
                   'Authorization':id
               },
               body: formdata
           })
           .then((resp)=> resp.json())
           .then((data)=>{
               sessionStorage.setItem("user", JSON.stringify(data.user))
               location.reload()
           })

        }
        let imagebutton= document.getElementById('uploadPic')
        imagebutton.addEventListener('click',uploadImage)

    
    }

    if (locate == "/user/register") {

        let alertbtn = document.getElementById('alerttext');
        let alertprompt = document.getElementById('alert-promt');
        let password1El = document.getElementById("password1")
        //checking if passwords match
        password1El.addEventListener('keyup', validPassword)

        const postUserData = (event) => {
            event.preventDefault();
            let fullname = document.forms["regform"]["fullname"].value;
            let email = document.forms["regform"]["email"].value;
            let address = document.forms["regform"]["address"].value;
            let password = document.forms["regform"]["password"].value;
            let password1 = document.forms["regform"]["password1"].value;
            let isAdmin = document.forms["regform"]["isAdmin"].value

            if(password !==  password1){
                alertbtn.innerHTML = "passwords do not match"
                return alertprompt.style.display = "block" 
            }

            const userData = {
                fullname: fullname,
                email: email,
                address: address,
                password: password,
                isAdmin: isAdmin
            }
            if (fullname == '' || email == '' || address == ' ' || password == '' || password1 == '') { //checking to ensure null values are not submitted
                alertbtn.innerHTML = "Fields cannot be empty"
                return alertprompt.style.display = "block"
            } else {
                //use fetch api to send data to server
                fetch('/user/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    })
                    .then((res) => res.json())
                    .then((data) => {
                        alertbtn.innerHTML = data.status
                        return alertprompt.style.display = "block"
                    })
            }
        }
        let btn = document.getElementById('register').addEventListener('click', postUserData);
    }


    if (locate == "/user/login") {
        let alertbtn = document.getElementById('alerttext');
        let alertprompt = document.getElementById('alert-promt');
        const loginUser = (loginEvent) => {
            loginEvent.preventDefault();
            let email = document.forms["loginform"]["email"].value;
            let password = document.forms["loginform"]["password"].value;
            if(email ==="" || password === ""){
                alertbtn.innerHTML = "password or email missing"
                return alertprompt.style.display = "block"
            }
            const userInfo = {
                email,
                password
            }
            try {
                fetch('/user/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userInfo)
                    })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.status == 'login successful') {
                            token = data.token
                            user = data.finduser
                            sessionStorage.userId = data.finduser._id
                            sessionStorage.token = JSON.stringify(token)
                            sessionStorage.user = JSON.stringify(user)
                            if (data.status == 'login successful' && user.isAdmin === true) {
                                return window.location.assign("/user/admin")
                            } else {
                                if (data.redirect !== undefined) {
                                    return window.location.assign(data.redirect, {
                                        headers: {
                                            'authorization': token
                                        }
                                    })
                                } else {
                                    return window.location.assign("/user/dashboard/", {
                                        headers: {
                                            'authorization': token
                                        }
                                    })
                                }

                            }

                        } else {
                            alertbtn.innerHTML = "login unsuccesful check email and password"
                            return alertprompt.style.display = "block"
                        }
                    })
            } catch (error) {
            }
        }
        let loginbtn = document.getElementById('login').addEventListener('click', loginUser);

    }

    if (window.location.pathname == '/user/admin') {
        let editaction = (e) => {
            e.preventDefault()

            let id = e.target.id
            let rowid = 'row' + id
            fetch('/user/getspecificproduct/:' + id)
                .then((resp) => resp.json())
                .then((data) => {
                    let name = document.getElementById('prodname').value = data.productName
                    let desc = document.getElementById('proddesc').value = data.productDescription
                    let price = document.getElementById('prodprice').value = data.price
                    let image = document.getElementById('prodimg')

                })

            let updateBtn = document.getElementById('updatebtn').addEventListener('click', (e) => {
                e.preventDefault()
                let formdata = new FormData()
                let name = document.forms['updateform']['producName1'].value
                let description = document.forms["updateform"]["productDescription1"].value;
                let price = document.forms["updateform"]["price1"].value;
                let image = document.getElementById('prodimg').files[0]

                formdata.append('productName', name)
                formdata.append('productDescription', description)
                formdata.append('price', price)
                formdata.append('productImage', image)

                fetch('/user/productupdate/:' + id, {
                        method: 'POST',
                        body: formdata
                    }).then((resp) => resp.json())
                    .then((data1) => {
                        let alert = document.getElementById('updatealert')
                        let row = document.getElementById(rowid)
                        let namecol = document.getElementById('name' + id)
                        let imagecol = document.getElementById('image' + id)
                        let desccol = document.getElementById('desc' + id)

                        setTimeout(() => {
                                namecol.innerHTML = data1.productName
                                imagecol.innerHTML = "<img src=" + data1.productImage + ">"
                                imagecol.style.borderRadius = "10px"
                                desccol.innerHTML = data1.productDescription
                            }, 2000)
                            //reseting the values in the table
                    })

            })


        }

        let delaction = (e) => {
            e.preventDefault()

            let del
            let yes = document.getElementById('yes').addEventListener('click', (eve) => {
                eve.preventDefault()
                let id = e.toElement.id
                fetch('/user/deleteproduct/:' + id)
                    .then((resp) => resp.json())
                    .then((data) => {
                        if (data != "failed") {
                            let deldiv = document.getElementById('delete-prompt')
                            let alert = document.getElementById('deleteprompt')
                            alert.innerHTML = "Record deleted"
                            deldiv.style.display = 'block'
                            document.getElementById(id).remove()
                        } else {
                            let deldiv = document.getElementById('delete-prompt')
                            let alert = document.getElementById('deleteprompt')
                            alert.innerHTML = "Operation failed"
                            deldiv.style.display = 'block'
                        }
                    })
            })

        }

        fetch('/user/getproducts')
            .then((resp) => resp.json())
            .then((data) => {
                let tbody = document.getElementById('tbody')
                for (i = 0; i < data.length; i++) {
                    let row = document.createElement('tr')
                    row.id = 'row' + data[i]._id
                    let thead = document.createElement("th")
                    let image = document.createElement('img')
                    image.style.borderRadius = "10px"
                    let editbtn = document.createElement('button')
                    editbtn.className = "fa fa-edit"
                    let deletebtn = document.createElement('button')
                    deletebtn.className = "fa fa-trash"
                    let colnum = document.createElement('td')
                    colnum.id = 'num' + data[i]._id
                    let colname = document.createElement('td')
                    colname.id = 'name' + data[i]._id
                    let colimage = document.createElement('td')
                    colimage.id = 'image' + data[i]._id
                    let coldescription = document.createElement('td')
                    coldescription.id = 'desc' + data[i]._id
                    let colcost = document.createElement('td')
                    colcost.id = 'cost' + data[i]._id
                    let coledit = document.createElement('td')
                    let coldelete = document.createElement('td')

                    image.src = data[i].productImage
                    colnum.innerHTML = i
                    colname.innerHTML = data[i].productName
                    colimage.appendChild(image)
                    coldescription.innerHTML = data[i].productDescription
                    colcost.innerHTML = data[i].price
                    coledit.appendChild(editbtn)
                    coldelete.appendChild(deletebtn)

                    deletebtn.id = data[i]._id
                    deletebtn.dataset.toggle = "modal"
                    deletebtn.dataset.target = "#deleteModal"
                    editbtn.id = data[i]._id
                    editbtn.dataset.toggle = "modal"
                    editbtn.dataset.target = "#updateModal"

                    deletebtn.addEventListener('click', delaction)
                    editbtn.addEventListener('click', editaction)

                    row.appendChild(colnum)
                    row.appendChild(colname)
                    row.appendChild(colimage)
                    row.appendChild(coldescription)
                    row.appendChild(colcost)
                    row.appendChild(coledit)
                    row.appendChild(coldelete)
                    tbody.appendChild(row)
                }

            })

            fetch("/user/getorders").then((resp)=>resp.json())
            .then((data)=>{
                let tbody = document.getElementById('ordertbody')
                for (i = 0; i < data.length; i++) {
                    sn =i
                    let row = document.createElement('tr')
                    row.id = 'row' + data[i]._id
                    let editbtn = document.createElement('button')
                    editbtn.className = "fa fa-edit"
                    let deletebtn = document.createElement('button')
                    deletebtn.className = "fa fa-trash"
                    let colnum = document.createElement('td')
                    colnum.id = 'ordercol' + data[i]._id
                    let serial = document.createElement('td')
                    let customer = document.createElement('td')
                    let Paymentfor = document.createElement('td')
                    let amount= document.createElement('td')
                    let deliveryAddress = document.createElement('td')
                    let state = document.createElement('td')
                    let phoneNumber = document.createElement('td')
                    let status = document.createElement('td')
                    let paymentStatus = document.createElement('td')
                    let order_Token = document.createElement('td')
                    let transacition_date = document.createElement('td')

                    customer.innerHTML = data[i].author.fullname
                    Paymentfor.innerHTML= data[i].summary
                    amount.innerHTML = data[i].totalCost
                    deliveryAddress.innerHTML = data[i].deliveryAddress
                    state.innerHTML = data[i].state
                    phoneNumber.innerHTML = data[i].phoneNumber
                    status.innerHTML = data[i].status
                    paymentStatus.innerHTML = data[i].paymentStatus
                    order_Token.innerHTML = data[i].orderToken
                    transacition_date.innerHTML = data[i].date
                    serial.innerHTML = sn



                    row.appendChild(serial)
                    row.appendChild(customer)
                    row.appendChild(Paymentfor)
                    row.appendChild(amount)
                    row.appendChild(deliveryAddress)
                    row.appendChild(state)
                    row.appendChild(phoneNumber)
                    row.appendChild(status)
                    row.appendChild(paymentStatus)
                    row.appendChild(order_Token)
                    row.appendChild(transacition_date)
                    row.appendChild(editbtn)


                    tbody.appendChild(row)

                    
                }
            })


        let produc = document.getElementById("produc")
        let table = document.createElement('table')
        let col = document.createElement('col')
        let row = document.createElement('row')
        let create = (event) => {
            event.preventDefault()
            let formdata = new FormData()
            let name = document.forms["productForm"]["producName"].value;
            let description = document.forms["productForm"]["productDescription"].value;
            let price = document.forms["productForm"]["price"].value;
            let image = document.querySelector('input[type="file"]').files[0]
            formdata.append('productName', name)
            formdata.append('productDescription', description)
            formdata.append('price', price)
            formdata.append('productImage', image)
            fetch('/user/productupload', {
                    method: 'POST',
                    body: formdata,
                }).then((resp) => resp.json())
                .then((data) => {
                    let prompt = document.getElementById('upload-alert')
                    let alert = document.getElementById('uploadalert')
                    alert.innerHTML = data
                    prompt.style.display = "block"
                    document.getElementById("productForm").reset()
                })
        }
        let submit = document.getElementById('productsubmit').addEventListener('click', create)

      
    }

    if (locate == "/user/createpost") {
        const sendpost = (e) => {
            e.preventDefault()
            let formdata = new FormData()
            let title = document.forms["postform"]["title"].value
            let content = document.forms["postform"]["content"].value
            let image = document.querySelector('input[type="file"]').files[0]

            formdata.append('title', title)
            formdata.append('content', content)
            formdata.append('image', image)
                // let creatbutton = document.getElementById('createbut')

            fetch('/user/createpost', {
                    method: 'POST',
                    body: formdata
                }).then((res) => res.json())
                .then((data) => {
                    if(data.status ==="post created"){
                      let postId =  data.post._id
                        window.location.assign(`/user/singlepost/${postId}`)
                    }
                })
        }

        document.getElementById('createbut').addEventListener('click', sendpost)
    }

    if (locate == "/user/blog") {
        fetch('/user/getposts')
            .then((resp) => resp.json())
            .then((data) => {
                let post_rev = document.getElementById('post-rev')
                for (i = 0; i < data.length; i++) {
                    let anchor = document.createElement('a')
                    let anchor2 = document.createElement('a')
                    let hr = document.createElement('br')
                    let br = document.createElement('hr')
                    br.style.height = "2px"
                    br.style.backgroundColor = "grey"
                    br.style.marginBottom = "20px"
                    let par = document.createElement('p')
                    par.className = "post-meta"
                    let h2 = document.createElement('h2')
                    h2.className = "post-title"
                    let h3 = document.createElement('h4')
                    let dat = document.createElement('span')
                    h3.className = "post-subtitle"
                    h2.innerHTML = data[i].title
                    h3.innerHTML = data[i].content
                    anchor.href = "/user/singlepost/" + data[i]._id
                    anchor.appendChild(h2)
                    anchor.appendChild(h3)
                    par.innerHTML = "posted by "
                    anchor2.innerHTML = data[i].author.fullname + " " + " on" + " " + data[i].date
                    dat.innerHTML = data[i].date
                        // anchor2.appendChild(dat)
                    par.appendChild(anchor2)
                    post_rev.appendChild(anchor)
                    post_rev.appendChild(par)
                    post_rev.append(br)

                }
            })
    }
    if (locate == "/user/singlepost/") {
    }

    //paymetpage
    if(locate == "/user/payment/?id="+searchId){

    }
    if(locate == "/user/resetpassword/"){
    let sendReset = function(event){
    event.preventDefault()
    let alert_prompt = document.getElementById("alert-prompt") 
    let alert = document.getElementById("alerttext")   
     let email = document.getElementById("email").value
     let formdata ={
         "email":email
     }
     fetch("/user/sendPasswordResetMail/",{
        headers: {
            'Content-Type': 'application/json'
        },
        method:'POST',
        body:JSON.stringify(formdata)
     }).then(resp=> resp.json()).then(data =>{
         alerttext.innerHTML = data
         alert_prompt.style.display = "block"
    })
    }
        let sendMail = document.getElementById('sendmail').addEventListener('click',sendReset)
    }


    if(locate == "/user/setnewpassword/:"+newToken){
        let password2 = document.getElementById("password2")
        password2.addEventListener('keyup',validPassword)
        let alert_prompt = document.getElementById("alert-prompt")
        let alerttext = document.getElementById("alerttext")

        let resetPass = (event)=>{
            event.preventDefault()
            let password = document.getElementById("password1").value
            formdata =  {
                "password":password
            }
            fetch(`/user/setnewpassword/${newToken}`,{
                headers: {
                    'Content-Type': 'application/json'
                },
                method:'POST',
                body:JSON.stringify(formdata)
             }).then(resp=> resp.json()).then(data =>{
                alerttext.innerHTML = data
                alert_prompt.style.display = "block"
           })
        }

        let resetPassword = document.getElementById("setpassword").addEventListener('click',resetPass)
    }
    if(locate == '/user/contact'){
        let alert =  document.getElementById('alert-prompt')
        let alerttext =  document.getElementById('alerttext')
    
        let submitMessage = function(event){
            event.preventDefault()
            let name =document.getElementById('name').value
            let phoneNumber =document.getElementById('phoneNumber').value
            let email =document.getElementById('email').value
            let message =document.getElementById('message').value
            let formdata = {
                "name":name,
                "email":email,
                "phoneNumber":phoneNumber,
               "message":message
            }
    
            fetch('/user/contact',{
                method:'POST',
                headers:{
                    'Content-Type':'Application/json'
                },
                body:JSON.stringify(formdata)
            }).then(resp => resp.json()).then(data=>{
             alerttext.innerHTML = data.status
            alert.style.display= "block"
            })
    
    
        }
    
        let sendMessage =  document.getElementById('submitMessage').addEventListener('click',submitMessage)
    }
    
}

