
var cart = {};
var goods = {};
var description = {};
var curCategory;

ready();



function timer() {
    var info = document.getElementsByClassName("show-good-info");
    for (var i = 0; i < info.length; i++) {
        info[i].addEventListener("click", function () {
            var id = $(this).attr('data-art');
            showPreview(id);
        })
    }
    var goodss = document.getElementsByClassName('goods-name');
    for (var i = 0; i < 13; i++) {
        try {
            for (var h = 0; h < 13; h++) {
                if (goodss[h].innerText === cart[i].name) {
                    var image = goodss[h].parentElement.getElementsByClassName('goods-img')[0].src;
                    createItem(image, cart[i].name, cart[i].price)
                }
            }
        } catch (e) {
        }

    }
    var obj = document.getElementsByClassName("ggg");
    for (var j = 0; j < obj.length; j++) {

        for (var i = 0; i < 13; i++) {
            try {
                var name = obj[j].parentElement.parentElement.getElementsByClassName('titleCart')[0].innerText;
                if (cart[i].name === name) {
                    obj[j].value = cart[i].quantity;
                }
            } catch (e) {
            }
        }
    }
    update()
}

$('document').ready(function () {
    loadCategories();
    loadGoodsFromCategory(0);
    acceptOrder();
});

function loadCategories() {
    //loading categories to the list of categories
    $.getJSON("https://nit.tron.net.ua/api/category/list", function (data) {
        var out = '';
        out += '<li class="category-item current" data-id="0" title="All goods">All devices</li>';
        description[1] = 'All devices';
        curCategory = 1;
        $('#goods-content-header').html(description[curCategory]);
        var cartID;
        for (var k in data) {
            cartID = data[k]['id'];
            out += '<li class="category-item" data-id="' + cartID + '">' + data[k]['name'] + '</li>';
            description[cartID] = data[k]['description'];
        }
        console.log(description);
        $('#categories-list ul').html(out);

        $('li.category-item').on('click', function () {
            var id = $(this).attr('data-id');
            if (curCategory !== id) {
                loadGoodsFromCategory(id);

                $('#goods-content-header').html(description[id]);
                $('.current').removeClass('current');
                $(this).addClass('current');
                curCategory = id;

            }
            try{
                setTimeout(function () {
                    var info = document.getElementsByClassName("show-good-info");
                    console.log("aaaaaaaaaa")
                    console.log(info.length);
                    for (var i = 0; i < info.length; i++) {
                        info[i].addEventListener("click", function () {
                            var id = $(this).attr('data-art');

                            showPreview(id);
                        })
                    }
                }, 10000);
            } catch (e) {
                setTimeout(function () {
                    var info = document.getElementsByClassName("show-good-info");
                    console.log("aaaaaaaaaa")
                    console.log(info.length);
                    for (var i = 0; i < info.length; i++) {
                        info[i].addEventListener("click", function () {
                            var id = $(this).attr('data-art');

                            showPreview(id);
                        })
                    }
                }, 10000);
            }


        });
    });
}

function loadGoodsFromCategory(id) {
    var source;
    if (id == 0) {
        source = "https://nit.tron.net.ua/api/product/list";
    } else source = 'https://nit.tron.net.ua/api/product/list/category/' + id;

    $.getJSON(source, function (data) {
        goods = data;
        var out = '';
        for (var key in data) {
            var goodsId = data[key]['id'];
            out += '<div class="goods-list">';
            var name = data[key]['name'];
            out += '<div class="goods-img-container">';
            out += '<img class="goods-img" src="' + data[key]['image_url'] + '" alt="' + name + '">';
            out += '</div>';
            out += '<span class="goods-name show-good-info" data-art="' + goodsId + '">' + name + '</span>';
            var price = data[key]['price'];
            var sprice = data[key]['special_price'];
            if (sprice != null) {
                out += '<span class="old-price">' + price + ' грн' + '</span>';
                out += '<span class="new-price">' + sprice + ' грн' + '</span>';
            } else {
                out += '<span class="price">' + price + ' грн' + '</span>';
            }
            out += '<button class="add-to-cart" data-id="' + goodsId + '" data-obj="' + key + '">Buy now!</button>';
            out += '</div>';
        }
        $('#goods-container').html(out);

        $('button.add-to-cart').on('click', function (event) {
            var but = event.target;
            var parent = but.parentElement;
            var image = parent.getElementsByClassName('goods-img')[0].src;
            var name = parent.getElementsByClassName('goods-name')[0].innerText;
            var price;

            try {

                price = parent.getElementsByClassName('price')[0].innerText;
            } catch (e) {

                price = parent.getElementsByClassName('new-price')[0].innerText;
            }

            price = price.replace(" грн", '');

            createItem(image, name, price);
            update()
            var id = $(this).attr('data-id');
            try{
                if (cart[id - 1] !== undefined) {
                } else {
                    cart[id - 1] = {};
                    cart[id - 1].name = name;
                    cart[id - 1].quantity = 1;
                    cart[id - 1].price = price;
                }
                localStorage.setItem('cart', JSON.stringify(cart))
            }catch(e){
                cart = {};
                localStorage.setItem('cart', JSON.stringify(cart))
                update()
                if (cart[id - 1] !== undefined) {
                } else {
                    cart[id - 1] = {};
                    cart[id - 1].name = name;
                    cart[id - 1].quantity = 1;
                    cart[id - 1].price = price;
                }
                localStorage.setItem('cart', JSON.stringify(cart))
            }

        });
    });
}

function acceptOrder() {
    var submitBut = document.getElementsByClassName("submitBut")[0];
    submitBut.addEventListener('click', function () {
        if (jQuery.isEmptyObject(cart)) {
            alert("Your cart is empty");
            return;
        }
        var inputs = document.getElementsByClassName("inputs");
        var name = inputs[0].value;
        var number = inputs[1].value;
        var email = inputs[2].value;
        var res = {
            name: name,
            phone: number,
            email: email,
            token: "LJB9b5Dye0787HFp2HtC"
        };
        var items = document.getElementsByClassName("goods-list");

        for (var i = 0; i < items.length; i++) {
            if (cart[i] !== undefined) {
                res["products[" + (i + 1) + "]"] = cart[i].quantity;
            }

        }
        $.ajax({
            url: "https://nit.tron.net.ua/api/order/add",
            method: "post",
            data: res,
            dataType: "json",
            success: function (res) {
                if (res.status === "error") {
                    alert("Check your data, is not valid");
                } else {
                    alert("Your order is accepted");
                    modal.style.display = "none";
                }
            }
        })


    });

}

function showPreview(id) {
    var link = 'https://nit.tron.net.ua/api/product/' + id;
    $.getJSON(link, function (data) {
        var out = '';

        out += '<div id="id01" class="modal">';
        out += '<div class="modal-content animate">';

        out += '<div class="imgcontainer">';
        out += '<span class="close" title="Close Preview">&times;</span>';
        out += '<img class="avatar" src="' + data['image_url'] + '" alt="Goods image">';
        out += '</div>';

        out += '<div class="container">';
        out += '<p class="preview-goods-name">' + data['name'] + '</p>';
        out += '<span style="font-style: italic">Description:</span>'
        out += '<p class="preview-description">' + data['description'] + '</p>';
        out += '</div>';
        out += '</div>';
        out += '</div>';

        $('#preview-frame').html(out);

        document.getElementById('id01').style.display = 'block';

        $('.cancel-prev-btn').on('click', function () {
            document.getElementById("id01").style.display = "none";
        });

        $('.close').on('click', function () {
            document.getElementById("id01").style.display = "none";
        });

        // Get the modal
        var modal = document.getElementById('id01');

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    });
}

function ready() {
    if(cart===null){
        localStorage.setItem("cart","{}");
    }
    if (cart.length === undefined) {
        cart = JSON.parse(localStorage.getItem('cart'))
    }
    try {
        setTimeout(timer, 500);
    } catch (e) {
        setTimeout(timer, 500);
    }

}


//modal window
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
    modal.style.display = "block";
};
span.onclick = function () {
    modal.style.display = "none";
};
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
update();

var purchBut = document.getElementsByClassName("purchaseBut")[0];
var cancelBut = document.getElementsByClassName("cancelBut")[0];
cancelBut.onclick = function () {
    var productInfo = document.getElementsByClassName("test")[0];
    var productProperties = document.getElementsByClassName("th")[0];
    productInfo.style.display = "block";
    productProperties.style.display = "block";
    var tt = document.getElementsByClassName("orderMenu")[0];
    tt.innerHTML = "";

    var sumbitBut = document.getElementsByClassName("submitBut")[0];
    var cancelBut = document.getElementsByClassName("cancelBut")[0];
    cancelBut.style.display = "none";
    sumbitBut.style.display = "none";
    purchBut.style.display = "block";


};
purchBut.onclick = function () {
    var productInfo = document.getElementsByClassName("test")[0];
    var productProperties = document.getElementsByClassName("th")[0];
    productInfo.style.display = "none";
    productProperties.style.display = "none";
    var out = '';
    out += '<div class="form-input-container">';

    out += '<form class="form-position" name="shopOrder" action="" method="post">';
    out += '<p class="form-user-name">Full name</p>';
    out += '<input name="name" class="inputs" placeholder="Your name" type="text" required>';
    out += '<p>Phone number</p>';
    out += '<input name="phone" class="inputs" placeholder="Your phone number" type="tel" required>';
    out += '<p>E-mail</p>';
    out += '<input name="email" class="inputs" placeholder="Your e-mail" type="email"  required>';
    out += '</form>';
    out += '</div>';
    var tt = document.getElementsByClassName("orderMenu")[0];
    tt.innerHTML = out;

    var sumbitBut = document.getElementsByClassName("submitBut")[0];
    var cancelBut = document.getElementsByClassName("cancelBut")[0];
    cancelBut.style.display = "block";
    sumbitBut.style.display = "block";
    purchBut.style.display = "none";


}


function plusProduct(event) {
    update();
    var product = event.target.parentElement.parentElement;
    var plus = product.getElementsByClassName('ggg')[0];
    plus.value++;
    var name = product.getElementsByClassName('titleCart')[0].innerText;
    for (var i = 0; i < 13; i++) {
        try {
            if (cart[i].name === name) {
                var test = cart[i].quantity;
                test++;
                cart[i].quantity = test;
            }
        } catch (e) {

        }

    }
    localStorage.setItem('cart', JSON.stringify(cart))
    update();
}


function minusProduct(event) {
    update();
    var product = event.target.parentElement.parentElement;
    var minus = product.getElementsByClassName('ggg')[0];
    minus.value--;
    if (minus.value < 1) {
        var name = product.getElementsByClassName('titleCart')[0].innerText;
        var cart1 = {};
        for (var i = 0; i < 13; i++) {
            try {
                if (cart[i].name !== name) {
                    cart1[i] = cart[i];
                }
            } catch (e) {

            }

        }
        cart = cart1;
        product.remove();
        update();
    }
    name = product.getElementsByClassName('titleCart')[0].innerText;
    for (var i = 0; i < 13; i++) {
        try {
            if (cart[i].name === name) {
                var test = cart[i].quantity;
                test--;
                cart[i].quantity = test;
            }
        } catch (e) {

        }

    }
    update();
}

function createItem(image11111, title, price) {
    //checks if the item is already entered to the cart
    var check = document.getElementsByClassName('titleCart');
    for (var l = 0; l < check.length; l++) {
        if (check[l].innerText === title) {
            alert("You have already added this item to the cart");
            return;
        }
    }

    //gets the values of the item
    var newItem = document.createElement('div');
    newItem.classList.add('layout-inline');
    newItem.classList.add('row');
    newItem.innerHTML = '' +
        '<div class="col col-pro layout-inline">\n' +
        '<img src="' + image11111 + '" alt="kitten" width="100px" height="100px" />\n' +
        '<p class="titleCart">' + title + '</p>\n' +
        '</div>\n' +

        '<div class="col col-price col-numeric align-center ">\n' +
        '<p>' + price + '</p>\n' +
        '</div>\n' +

        '<div class="col col-qty layout-inline">\n' +
        '<a href="#" class="qty qty-minus">-</a>\n' +
        '<input type="numeric" class="ggg" value="1" />\n' +
        '<a href="#" class="qty qty-plus">+</a>\n' +
        '</div>\n';
    //adds
    document.getElementsByClassName('test')[0].append(newItem);
}

function update() {
    //cart counter
    var cartNumber = document.getElementsByClassName("ggg");
    var counter = 0;
    for (var i = 0; i < cartNumber.length; i++) {
        counter += parseInt(cartNumber[i].value);
    }
    var buttonText = document.getElementById('myBtn');
    buttonText.innerHTML = 'Cart: ' + counter;


    //button + action
    var btnPlus = document.getElementsByClassName('qty-plus');
    for (var i = 0; i < btnPlus.length; i++) {
        var btn1 = btnPlus[i];
        btn1.addEventListener('click', plusProduct);
    }
    //button - action
    var btnMinus = document.getElementsByClassName('qty-minus');
    for (var i = 0; i < btnMinus.length; i++) {
        var btn2 = btnMinus[i];
        btn2.addEventListener('click', minusProduct);
    }
    //if number of the item is <0
    var t = document.getElementsByClassName('ggg');
    for (var g = 0; g < t.length; g++) {
        t[g].addEventListener('change', function (event) {
            var input = event.target;
            if (isNaN(input.value) || input.value <= 0) {
                input.parentElement.parentElement.remove();
                update();
            }
            update()
        });
    }
    // total price counter
    var t2 = document.getElementsByClassName('ggg');
    var totalPrice = 0;
    for (var h = 0; h < t2.length; h++) {
        var copy = t2[h].value;
        copy *= parseFloat(t[h].parentElement.parentElement.getElementsByClassName("col-price")[0].innerText.replace('$', ''));
        totalPrice += copy;
    }
    totalPrice = Math.round(totalPrice * 100) / 100;

    if (t2.length === 0)
        totalPrice = 0;
    document.getElementById("total").innerHTML = "Total = " + totalPrice + "$";
    localStorage.setItem('cart', JSON.stringify(cart))

}
