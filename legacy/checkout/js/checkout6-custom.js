const _CHECKOUT = {

	init: function(){
		this.whoIm()
	},

	whoIm: function(){
		var e = window.location.hash;
		if (e.match(/(cart|profile|email|payment|shipping)/)){ this.allCheckout() }
		if (e.match(/cart/)){ this.stepCart() }
		if (e.match(/email/)){ this.stepIdentification() }
		if (e.match(/profile/)){ this.stepProfile() }
		if (e.match(/payment/)){ this.stepPayment() }
		if (e.match(/shipping/)){ this.stepShipping() }
	},

	//Estou no Checkout
	allCheckout: function(){
		// console.log(`Qualquer página do Checkout`);
	},

	//Altera em que passo o usuário se encontra
	changeStep: function(pos){
		$(`.header-steps__item`).removeClass(`is--active`);
		$(`.header-steps__item[data-pos='${pos}'`).addClass(`is--active`);
	},

	//Estou no Cart
	stepCart: function(){
		this.changeStep(1);
	},

	//Estou no Checkout Identificação
	stepIdentification: function(){
		this.changeStep(2);
	},

	//Estou no Checkout Profile
	stepProfile: function(){
		this.changeStep(2);
	},

	//Estou no Checkout shipping
	stepShipping: function(){
		this.changeStep(2);
	},

	//Estou no Checkout Payment
	stepPayment: function(){
		this.changeStep(3);
	},

	//Altera o texto do placeholder do campo de cupom
	handlerCupom: function(){
		setTimeout(function(){
			$(".coupon-column #cart-coupon").attr("placeholder", "Digite aqui seu cupom de desconto");
			$(".coupon-column #cart-coupon-add").text("Aplicar");
		}, 1000)
	},

	duplicateButtonCheckout: function(){
		setTimeout(function(){
			if( $("#cart-template-header").length == 0 ){
				$(".container-cart").prepend(`<div id="cart-template-header"></div>`);

				let cloneButton = $(".cart-links").clone();
				$(cloneButton).prependTo("#cart-template-header");
				$( $("#cart-title") ).prependTo("#cart-template-header")
			}
		}, 1000)
	}

}

//Evento de mudança de URL/Passos na Vtex
$(window).on("hashchange", function(e) {
	_CHECKOUT.whoIm()
});

$(window).on("stateUpdated.vtex", function (e, state, c) {
	// console.log("stateUpdated")
	// _CHECKOUT.duplicateButtonCheckout();
});

$(window).on("componentValidated.vtex", function (event) {
	// console.log("componentValidated")
	_CHECKOUT.handlerCupom();
});

$(window).on("componentDone.vtex", function( event ) {
	// console.log("componentDone")
	_CHECKOUT.handlerCupom();
});

$(window).on('checkoutRequestBegin.vtex', function (ajaxOptions) {
	// console.log('checkoutRequestBegin');
});

$(window).on('checkoutRequestEnd.vtex', function (evt, orderForm) {
	console.log('checkoutRequestEnd');
});

//Inicia funções
$(window).ready(function(){
	_CHECKOUT.init();
})



$((function() {
    ({
        init: function() {
            $(document).ready((()=>{
                this.eventOrderFormUpdated(),
                this.eventHashChange(),
                this.eventLoad(),
                this.eventAjaxSuccess(),
                this.eventHandlers(),
                this.showEmailInfo(),
                this.setLayoutPreEmail(),
                // this.sellerFormHandler(),
                this.moveButtonBuy(),
                this.complementField()
            }
            ))
        },
        isPartOfClub: !1,
        eventOrderFormUpdated: function() {
            $(window).on("orderFormUpdated.vtex", ((e,t)=>{
                this.updateLayoutCouponDiscount(),
                this.insertBtnFinishPayment(),
                this.discountPrice(t)
            }
            ))
        },
        eventHashChange: function() {
            $(window).on("hashchange", (()=>{
                this.setLayoutPreEmail(),
                this.setNewsletterText(),
                this.moveButtonBuy(),
                // this.sellerFormHandler(),
                this.removeCouponMessage(),
                this.insertBtnFinishPayment(),
                this.eventEmailInformed(),
                this.eventShippingInformed(),
                this.discountPrice(),
                this.complementField()
            }
            ))
        },
        eventAjaxSuccess: function() {
            $(document).ajaxSuccess(((e,t,n)=>{
                -1 !== n.url.indexOf("api/checkout/pub/profiles"),
                -1 !== n.url.indexOf("/attachments/shippingData") && this.eventShippingPreview()
            }
            ))
        },
        eventLoad: function() {
            $(window).on("load", (()=>{
                this.checkShipping(),
                this.eventEmailInformed(),
                this.eventShippingInformed()
            }
            ))
        },
        eventHandlers: function() {
            const e = $("#client-profile-data");
            $("#payment-data").on("click", ".payment-group-item", (()=>{
                this._isMobile() && $("html, body").animate({
                    scrollTop: $(".steps-view").offset().top - 30
                }, 400)
            }
            )),
            this.returnEventCart("removeFromCart", ".item-quantity-change-decrement"),
            this.returnEventCart("addToCart", ".item-quantity-change-increment"),
            this.returnEventCart("removeFromCart", ".item-link-remove"),
            e.on("keyup", "#client-first-name, #client-last-name", (function() {
                const e = $(this);
                e.val(e.val().replace(/[^a-zA-Z0-9s]/g, ""))
            }
            ))
        },
        returnEventCart: function(e, t) {
            $(".full-cart").on("click", t, (function() {
                let n, i;
                const a = $(this).parents().find(".product-item").attr("data-sku")
                  , o = vtexjs.checkout.orderForm.items.find((e=>e.id === a))
                  , s = Object.values(o.productCategories).join("/");
                n = ".item-link-remove" === t ? o.quantity : "removeFromCart" === e ? o.quantity - 1 : o.quantity + 1;
                const r = [{
                    brand: o.additionalInfo.brandName,
                    category: s,
                    id: a,
                    name: o.name,
                    price: o.sellingPrice,
                    quantity: n,
                    variant: o.skuName
                }];
                i = "addToCart" === e ? {
                    currencyCode: "BRL",
                    event: "addToCart",
                    add: {
                        products: r
                    }
                } : {
                    currencyCode: "BRL",
                    event: "removeFromCart",
                    remove: {
                        products: r
                    }
                },
                dataLayer.push(i)
            }
            ))
        },
        checkShipping: function() {
            const {totalizers: e} = vtexjs.checkout.orderForm;
            if (!e)
                return;
            e.some((({id: e})=>"Shipping" === e)) && this.eventShippingPreview()
        },
        eventShippingPreview: function() {
            if ("#/cart" !== window.location.hash)
                return;
            const e = vtexjs.checkout.orderForm.totalizers.find((({id: e})=>"Shipping" === e));
            if (!e.value)
                return;
            const t = vtexjs.checkout.orderForm.items.map((e=>item = {
                id: e.id,
                qtd: e.quantity
            }));
            dataLayer.push({
                event: "shippingPreview",
                product: t,
                shippingTotal: e.value
            })
        },
        eventEmailInformed: function() {
            const {orderFormId: e} = vtexjs.checkout.orderForm
              , t = $("#client-email").val()
              , n = $(".client-profile-summary .name").text()
              , i = $("#client-document").val();
            "#/payment" === window.location.hash && (n.length || i.length) && dataLayer.push({
                event: "emailInformed",
                orderFormId: e,
                formEmail: t
            })
        },
        eventShippingInformed: function() {
            const {orderFormId: e, items: t} = vtexjs.checkout.orderForm
              , n = $("#client-email").val()
              , i = $(".address-summary").text();
            if ("#/payment" !== window.location.hash || !n.length && !i.length)
                return;
            const a = t.map((e=>({
                id: e.id,
                name: e.name,
                category: e.productCategories,
                quantity: e.quantity,
                brand: e.additionalInfo.brandName,
                price: e.price
            })));
            dataLayer.push({
                event: "shippingInformed",
                orderFormId: e,
                formEmail: n,
                ecommerce: {
                    checkout: {
                        actionField: {
                            step: 4
                        },
                        products: [a]
                    }
                },
                visitorDemographicInfo: [i]
            })
        },

        showEmailInfo: function() {
            const e = this._getEmailInfoItens();
            let t = "";
            for (let n = 0; n < e.length; n++)
                t += `<div class="emailInfo__container__item">\n            <div class="emailInfo__container__item--icon">\n              ${e[n].icon}\n            </div>\n            <p class="emailInfo__container__item--text">${e[n].text}</p>\n          </div>`;
            $(".emailInfo").html('<h3 data-i18n="clientProfileData.whyPreEmail">Usamos seu e-mail de forma 100% segura para:</h3><div id="container-email-info" class="emailInfo__container"></div>'),
            $(".emailInfo__container").append(t)
        },
        setLayoutPreEmail: function() {
            "#/email" === window.location.hash ? $(".container").addClass("layout-pre-email") : $(".container").removeClass("layout-pre-email")
        },
        setNewsletterText: function() {
            $(".newsletter-text").text("Quero receber promoções e novidades no meu e-mail. ")
        },
        updateLayoutCouponDiscount: function() {
            "#/cart" === window.location.hash && ($(".discount").is(":visible") ? $(".product-item").addClass("discount-visible") : $(".product-item").removeClass("discount-visible"))
        },
        moveButtonBuy: function() {
            "#/cart" === window.location.hash && $(".full-cart .summary-template-holder").append($(".pull-right.cart-links"))
        },
        insertTextVariousPackages: function(e=vtexjs.checkout.orderForm) {
            if ("#/cart" === window.location.hash && e && e.shippingData && e.shippingData.logisticsInfo) {
                const {logisticsInfo: t} = e.shippingData
                  , n = [];
                t.forEach((e=>{
                    const t = e.slas.find((t=>t.id == e.selectedSla));
                    t && n.push(t.transitTime)
                }
                ));
                const i = [...new Set(n)].length;
                $(".shipping-many-packages").remove(),
                i > 1 && $("#shipping-preview-container").after(`<p class="shipping-many-packages">Para que você receba o quanto antes, estamos separando em <strong>\n            ${i}</strong> entregas para você poder desfrutar da sua compra o mais breve possível.</p>`)
            }
        },
        couponMessageContent: function(e, t) {
            if (($(e).parent().find(".coupon-message") || $(t).parent().find(".coupon-message")).length)
                return;
            const n = '<div class="coupon-message">\n        <span class="icon"></span>\n        <span>\n          Você <strong>recebeu descontos</strong></div>\n      ';
            e.after(n),
            t.before(n)
        },
        appendDiscountText: function() {
            const e = $(".full-cart .summary-totalizers .coupon-column.summary-coupon-wrap")
              , t = $(".cart-template.mini-cart .cart-fixed");
            this.couponMessageContent(e, t)
        },
        removeCouponMessage: function() {
            this.isPartOfClub || $(".coupon-message").remove()
        },
        sendSellerCode: function(e) {
            this._sendAttachment("openTextField", {
                value: e
            }),
            this._sendAttachment("marketingData", {
                utmSource: e
            }),
            $(".success-code").removeClass("hide"),
            setTimeout((()=>{
                $(".success-code").addClass("hide")
            }
            ), 4e3)
        },
        insertSellerDefaultData: function() {
            vtexjs.checkout.getOrderForm().done((e=>{
                const {marketingData: t} = e;
                if (!t || !t.utmSource || -1 === t.utmSource.toUpperCase().indexOf("LEC") || -1 !== t.utmSource.toUpperCase().indexOf("LEC-EXC"))
                    return;
                const n = t.utmSource;
                $("#sellerCode").val(n),
                this._sendAttachment("openTextField", {
                    value: n
                }),
                this._lecBlockInput()
            }
            ))
        },
        inserHtmlFormSeller: function() {
            $(".sellerCodeDiv").length || $(".full-cart .cart-totalizers .coupon-column").append('<div class="sellerCodeDiv">\n          <label for="sellerCode" class="code-label">Código do vendedor</label>\n          <input maxlength="15" type="text" id="sellerCode" value="LEC" name="sellerCode" class="seller-input">\n          <button class="seller-btn apply">Aplicar</button>\n          <button class="seller-btn remove hide">Excluir</button>\n          <span class="success-code hide">Operação validada!</span>\n          <span class="error-code hide">Preencha o código LEC</span>\n        </div>')
        },
        sellerEvents: function() {
            $(".seller-btn.apply").off().on("click", (()=>{
                if ("LEC" === $("#sellerCode").val())
                    return $(".error-code").removeClass("hide"),
                    void setTimeout((()=>{
                        $(".error-code").addClass("hide")
                    }
                    ), 3e3);
                this.sendSellerCode($("#sellerCode").val()),
                this._lecBlockInput()
            }
            )),
            $(".seller-btn.remove").off().on("click", (()=>{
                this.sendSellerCode("LEC-EXC"),
                this._lecUnlockInput(),
                $("#sellerCode").val("LEC")
            }
            )),
            $("#sellerCode").off().on("keyup", (function() {
                $(this).val().length < 4 && $(this).val("LEC")
            }
            ))
        },
        sellerFormHandler: function() {
            "#/cart" === window.location.hash && (this.inserHtmlFormSeller(),
            this.insertSellerDefaultData(),
            this.sellerEvents())
        },
        setTextPrice: function(e, t) {
            if (!$(`${t} .total-discount-price`).length)
                return `<span class="total-discount-price"> ${this._formatPrice(e)} à vista<span>`
        },
        totalPriceTemplate: function(e, t, n) {
            const i = `.cart-items .product-item[data-sku=${n}]`
              , a = $(`${i} .product-price`)
              , o = $(`${i} .quantity-price`);
            if (this._isPhone())
                return o.append(this.setTextPrice(e, i)),
                null;
            a.append(this.setTextPrice(t, i))
        },
        resultPriceWithDiscount: function(e, t, n=1) {
            const i = t.reduce(((e,t)=>e - e * (Number(t) / 100)), e);
            return Number(i) * n
        },
        verifyPrice: function(e, t, n, i) {
            const a = e / 100
              , o = this.resultPriceWithDiscount(a, n, t)
              , s = this.resultPriceWithDiscount(a, n);
            this.totalPriceTemplate(o, s, i)
        },
        discountPrice: function(e=vtexjs.checkout.orderForm) {
            const {items: t} = e;
            (t || t.length) && t.forEach((({price: e, id: t, quantity: n})=>{
                const i = {
                    items: [{
                        id: t,
                        quantity: 1,
                        seller: "1"
                    }]
                };
                this._getSimulation(i).then((i=>{
                    const a = i.ratesAndBenefitsData.teaser;
                    if (!a && !a.length)
                        return;
                    const o = a.map((({effects: e, name: t})=>{
                        if (!t.toLowerCase().includes("a vista"))
                            return null;
                        const {value: n} = e.parameters.find((e=>"PercentualDiscount" === e.name));
                        return n
                    }
                    ));
                    o.length && o[0] && this.verifyPrice(e, n, o, t)
                }
                ))
            }
            ))
        },
        complementField: function() {
            const e = setInterval((()=>{
                "#/shipping" === window.location.hash && 60 !== $("#ship-complement").attr("maxlength") && this._maxLetter("input#ship-complement", 60),
                $("#force-shipping-fields, #edit-address-button").click((()=>{
                    this.complementField()
                }
                )),
                "#/shipping" !== window.location.hash && clearInterval(e)
            }
            ), 4e3)
        },
        _maxLetter: function(e, t) {
            $(e).attr("maxlength", t)
        },
        _readOnlyInput: function(e) {
            $(e).attr("readonly") || $(e).attr("readonly", !0)
        },
        _formatPrice: function(e) {
            return e.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })
        },
        _getSimulation: function(e) {
            return $.ajax({
                url: "/api/checkout/pub/orderforms/simulation",
                type: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(e)
            })
        },
        _getEmailInfoItens: function() {
            return [{
                icon: '<svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">\n              <path d="M9.375 11.1628H23.625M16.5 18.907H9.375M21.25 15.1395H9.375M21.25 22.8837H9.375M7 24.1395V3L9.375 5.30233L11.75 3L14.125 5.30233L16.5 3L18.875 5.30233L21.25 3L23.625 5.30233L26 3V30L23.625 27.6977L21.25 30L18.875 27.6977L16.5 30L14.125 27.6977L11.75 30L9.375 27.6977L7 30V24.1395Z" stroke="#ED1B2F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n              </svg>',
                text: "Notificar sobre pedidos"
            }, {
                icon: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <g clip-path="url(#clip0)">\n            <path d="M27.3137 4.68628C24.2917 1.66431 20.2737 0 16 0C11.7261 0 7.70825 1.66431 4.68628 4.68628C1.66431 7.70825 0 11.7261 0 16C0 20.2737 1.66431 24.2917 4.68628 27.3137C7.70825 30.3357 11.7261 32 16 32C20.2737 32 24.2917 30.3357 27.3137 27.3137C30.3357 24.2917 32 20.2737 32 16C32 11.7261 30.3357 7.70825 27.3137 4.68628ZM8.02124 27.6492C8.69043 23.7961 12.0293 20.9541 16 20.9541C19.9709 20.9541 23.3096 23.7961 23.9788 27.6492C21.707 29.21 18.9585 30.125 16 30.125C13.0415 30.125 10.293 29.21 8.02124 27.6492ZM10.9126 13.9917C10.9126 11.1863 13.1948 8.9043 16 8.9043C18.8052 8.9043 21.0874 11.1865 21.0874 13.9917C21.0874 16.7969 18.8052 19.0791 16 19.0791C13.1948 19.0791 10.9126 16.7969 10.9126 13.9917ZM25.6028 26.3486C25.0981 24.5549 24.0959 22.9275 22.6912 21.6562C21.8293 20.8762 20.8484 20.2607 19.7937 19.8269C21.7 18.5835 22.9626 16.4324 22.9626 13.9917C22.9626 10.1526 19.8391 7.0293 16 7.0293C12.1609 7.0293 9.0376 10.1526 9.0376 13.9917C9.0376 16.4324 10.3003 18.5835 12.2063 19.8269C11.1519 20.2607 10.1707 20.876 9.30884 21.656C7.9043 22.9272 6.90186 24.5547 6.39722 26.3484C3.61768 23.7671 1.875 20.0835 1.875 16C1.875 8.21143 8.21143 1.875 16 1.875C23.7886 1.875 30.125 8.21143 30.125 16C30.125 20.0837 28.3823 23.7673 25.6028 26.3486Z" fill="#ED1B2F"/>\n            </g><defs><clipPath id="clip0"><rect width="32" height="32" fill="white"/></clipPath></defs>\n            </svg>',
                text: "Identificar o seu perfil"
            }, {
                icon: '<svg width="34" height="33" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <mask id="path-1-inside-1" fill="white">\n            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2448 27.4276C16.2448 27.4353 16.2438 27.4431 16.2427 27.4509C16.2417 27.4586 16.2406 27.4664 16.2406 27.4741C16.2406 28.8671 17.6074 30 19.2898 30H29.4508C31.1333 30 32.5 28.8671 32.5 27.4741C32.5 27.4586 32.5 27.4431 32.4958 27.4276L31.3327 15.1941C31.3078 14.9225 31.0627 14.7169 30.776 14.7169H28.3832C28.35 12.676 26.5637 11.027 24.3703 11.027C22.6269 11.027 21.1406 12.0689 20.5875 13.5212C20.4448 13.896 20.3642 14.2982 20.3574 14.7169H17.9646C17.6738 14.7169 17.4329 14.9225 17.408 15.1941L16.2448 27.4276ZM17.3623 27.4974C17.3789 28.3006 18.2346 28.9524 19.2898 28.9524H29.4508C30.5019 28.9524 31.3618 28.3006 31.3784 27.4974L30.2609 15.7683H28.3832V17.3591C28.3832 17.6501 28.134 17.8829 27.8224 17.8829C27.5109 17.8829 27.2616 17.6501 27.2616 17.3591V15.7683H21.4749V17.3591C21.4749 17.6222 21.2711 17.8378 21.0017 17.8767C20.9731 17.8808 20.9439 17.8829 20.9141 17.8829C20.6025 17.8829 20.3532 17.6501 20.3532 17.3591V15.7683H18.4756L17.3623 27.4974ZM27.2616 14.7169C27.2284 13.2541 25.9447 12.0746 24.3703 12.0746C22.7959 12.0746 21.5123 13.2541 21.479 14.7169H27.2616Z"/>\n            <path fill-rule="evenodd" clip-rule="evenodd" d="M20.0748 8.1287L20.4663 12.2464C20.0961 12.7566 19.8339 13.3456 19.7145 13.9871H19.2465L18.7557 8.83545H16.4447V10.7933C16.4447 11.1515 16.138 11.438 15.7545 11.438C15.371 11.438 15.0643 11.1515 15.0643 10.7933V8.83545H7.94214V10.7933C7.94214 11.1515 7.63537 11.438 7.25191 11.438C6.86845 11.438 6.56168 11.1515 6.56168 10.7933V8.83545H4.25069L2.88046 23.2713C2.90091 24.2598 3.95415 25.062 5.2528 25.062H15.7517L15.6291 26.3514H5.2528C3.18211 26.3514 1.5 24.957 1.5 23.2426C1.5 23.2331 1.50128 23.2235 1.50256 23.214C1.50383 23.2044 1.50511 23.1949 1.50511 23.1853L2.9367 8.1287C2.96738 7.79443 3.26392 7.54134 3.62181 7.54134H6.56679C6.60769 5.02951 8.8062 3 11.5058 3C14.2053 3 16.4038 5.02951 16.4447 7.54134H19.3897C19.7425 7.54134 20.0441 7.79443 20.0748 8.1287ZM11.5058 4.28934C13.4435 4.28934 15.0234 5.74104 15.0643 7.54134H7.94725C7.98815 5.74104 9.56801 4.28934 11.5058 4.28934Z"/>\n            </mask>\n            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2448 27.4276C16.2448 27.4353 16.2438 27.4431 16.2427 27.4509C16.2417 27.4586 16.2406 27.4664 16.2406 27.4741C16.2406 28.8671 17.6074 30 19.2898 30H29.4508C31.1333 30 32.5 28.8671 32.5 27.4741C32.5 27.4586 32.5 27.4431 32.4958 27.4276L31.3327 15.1941C31.3078 14.9225 31.0627 14.7169 30.776 14.7169H28.3832C28.35 12.676 26.5637 11.027 24.3703 11.027C22.6269 11.027 21.1406 12.0689 20.5875 13.5212C20.4448 13.896 20.3642 14.2982 20.3574 14.7169H17.9646C17.6738 14.7169 17.4329 14.9225 17.408 15.1941L16.2448 27.4276ZM17.3623 27.4974C17.3789 28.3006 18.2346 28.9524 19.2898 28.9524H29.4508C30.5019 28.9524 31.3618 28.3006 31.3784 27.4974L30.2609 15.7683H28.3832V17.3591C28.3832 17.6501 28.134 17.8829 27.8224 17.8829C27.5109 17.8829 27.2616 17.6501 27.2616 17.3591V15.7683H21.4749V17.3591C21.4749 17.6222 21.2711 17.8378 21.0017 17.8767C20.9731 17.8808 20.9439 17.8829 20.9141 17.8829C20.6025 17.8829 20.3532 17.6501 20.3532 17.3591V15.7683H18.4756L17.3623 27.4974ZM27.2616 14.7169C27.2284 13.2541 25.9447 12.0746 24.3703 12.0746C22.7959 12.0746 21.5123 13.2541 21.479 14.7169H27.2616Z" fill="#ED1B2F"/>\n            <path fill-rule="evenodd" clip-rule="evenodd" d="M20.0748 8.1287L20.4663 12.2464C20.0961 12.7566 19.8339 13.3456 19.7145 13.9871H19.2465L18.7557 8.83545H16.4447V10.7933C16.4447 11.1515 16.138 11.438 15.7545 11.438C15.371 11.438 15.0643 11.1515 15.0643 10.7933V8.83545H7.94214V10.7933C7.94214 11.1515 7.63537 11.438 7.25191 11.438C6.86845 11.438 6.56168 11.1515 6.56168 10.7933V8.83545H4.25069L2.88046 23.2713C2.90091 24.2598 3.95415 25.062 5.2528 25.062H15.7517L15.6291 26.3514H5.2528C3.18211 26.3514 1.5 24.957 1.5 23.2426C1.5 23.2331 1.50128 23.2235 1.50256 23.214C1.50383 23.2044 1.50511 23.1949 1.50511 23.1853L2.9367 8.1287C2.96738 7.79443 3.26392 7.54134 3.62181 7.54134H6.56679C6.60769 5.02951 8.8062 3 11.5058 3C14.2053 3 16.4038 5.02951 16.4447 7.54134H19.3897C19.7425 7.54134 20.0441 7.79443 20.0748 8.1287ZM11.5058 4.28934C13.4435 4.28934 15.0234 5.74104 15.0643 7.54134H7.94725C7.98815 5.74104 9.56801 4.28934 11.5058 4.28934Z" fill="#ED1B2F"/>\n            <path d="M17.3623 27.4974L15.3712 27.3084L15.3603 27.4234L15.3627 27.5388L17.3623 27.4974ZM31.3784 27.4974L33.378 27.5388L33.3803 27.423L33.3694 27.3077L31.3784 27.4974ZM30.2609 15.7683L32.2519 15.5786L32.0794 13.7683H30.2609V15.7683ZM28.3832 15.7683V13.7683H26.3832V15.7683H28.3832ZM27.2616 15.7683H29.2616V13.7683H27.2616V15.7683ZM21.4749 15.7683V13.7683H19.4749V15.7683H21.4749ZM21.0017 17.8767L20.7161 15.8971L20.7161 15.8971L21.0017 17.8767ZM20.3532 15.7683H22.3532V13.7683H20.3532V15.7683ZM18.4756 15.7683V13.7683H16.6564L16.4845 15.5793L18.4756 15.7683ZM16.2448 27.4276L14.2538 27.2383L14.2448 27.3327V27.4276H16.2448ZM32.4958 27.4276L30.5048 27.6169L30.5207 27.7833L30.5639 27.9448L32.4958 27.4276ZM31.3327 15.1941L29.341 15.3769L29.3417 15.3834L31.3327 15.1941ZM28.3832 14.7169L26.3835 14.7494L26.4155 16.7169H28.3832V14.7169ZM20.5875 13.5212L18.7185 12.8094V12.8094L20.5875 13.5212ZM20.3574 14.7169V16.7169H22.3251L22.3571 14.7494L20.3574 14.7169ZM17.408 15.1941L19.399 15.3834L19.3996 15.3769L17.408 15.1941ZM20.4663 12.2464L22.085 13.4211L22.5289 12.8095L22.4574 12.0571L20.4663 12.2464ZM20.0748 8.1287L18.0832 8.31148L18.0838 8.31801L20.0748 8.1287ZM19.7145 13.9871V15.9871H21.3769L21.6808 14.3528L19.7145 13.9871ZM19.2465 13.9871L17.2556 14.1768L17.428 15.9871H19.2465V13.9871ZM18.7557 8.83545L20.7467 8.64576L20.5742 6.83545H18.7557V8.83545ZM16.4447 8.83545V6.83545H14.4447V8.83545H16.4447ZM15.0643 8.83545H17.0643V6.83545H15.0643V8.83545ZM7.94214 8.83545V6.83545H5.94214V8.83545H7.94214ZM6.56168 8.83545H8.56168V6.83545H6.56168V8.83545ZM4.25069 8.83545V6.83545H2.43154L2.25964 8.64646L4.25069 8.83545ZM2.88046 23.2713L0.889407 23.0823L0.878498 23.1972L0.880886 23.3126L2.88046 23.2713ZM15.7517 25.062L17.7427 25.2513L17.9508 23.062H15.7517V25.062ZM15.6291 26.3514V28.3514H17.4479L17.6201 26.5407L15.6291 26.3514ZM1.50256 23.214L-0.479764 22.9486L1.50256 23.214ZM1.50511 23.1853L-0.485908 22.996L-0.494887 23.0904V23.1853H1.50511ZM2.9367 8.1287L4.92773 8.31801L4.92833 8.31148L2.9367 8.1287ZM6.56679 7.54134V9.54134H8.53449L8.56653 7.5739L6.56679 7.54134ZM16.4447 7.54134L14.445 7.5739L14.477 9.54134H16.4447V7.54134ZM15.0643 7.54134V9.54134H17.1102L17.0638 7.49591L15.0643 7.54134ZM7.94725 7.54134L5.94777 7.49591L5.90129 9.54134H7.94725V7.54134ZM27.2616 14.7169V16.7169H29.3076L29.2611 14.6714L27.2616 14.7169ZM21.479 14.7169L19.4795 14.6714L19.4331 16.7169H21.479V14.7169ZM19.2898 26.9524C19.1619 26.9524 19.1164 26.9108 19.1437 26.9314C19.1708 26.952 19.3548 27.1172 19.3618 27.4561L15.3627 27.5388C15.411 29.8726 17.6502 30.9524 19.2898 30.9524V26.9524ZM29.4508 26.9524H19.2898V30.9524H29.4508V26.9524ZM29.3788 27.4561C29.3859 27.1139 29.572 26.9491 29.5966 26.9306C29.6218 26.9115 29.5754 26.9524 29.4508 26.9524V30.9524C30.3773 30.9524 31.2863 30.6674 32.0084 30.1216C32.7298 29.5764 33.3543 28.6841 33.378 27.5388L29.3788 27.4561ZM28.2699 15.958L29.3874 27.6871L33.3694 27.3077L32.2519 15.5786L28.2699 15.958ZM28.3832 17.7683H30.2609V13.7683H28.3832V17.7683ZM30.3832 17.3591V15.7683H26.3832V17.3591H30.3832ZM27.8224 19.8829C29.1077 19.8829 30.3832 18.8811 30.3832 17.3591H26.3832C26.3832 16.4191 27.1602 15.8829 27.8224 15.8829V19.8829ZM25.2616 17.3591C25.2616 18.8811 26.5371 19.8829 27.8224 19.8829V15.8829C28.4846 15.8829 29.2616 16.4191 29.2616 17.3591H25.2616ZM25.2616 15.7683V17.3591H29.2616V15.7683H25.2616ZM21.4749 17.7683H27.2616V13.7683H21.4749V17.7683ZM23.4749 17.3591V15.7683H19.4749V17.3591H23.4749ZM21.2872 19.8562C22.4273 19.6917 23.4749 18.7269 23.4749 17.3591H19.4749C19.4749 16.5176 20.1148 15.9839 20.7161 15.8971L21.2872 19.8562ZM20.7161 15.8971C20.7822 15.8876 20.8484 15.8829 20.9141 15.8829V19.8829C21.0394 19.8829 21.1641 19.8739 21.2872 19.8562L20.7161 15.8971ZM20.9141 15.8829C21.5762 15.8829 22.3532 16.4191 22.3532 17.3591H18.3532C18.3532 18.8811 19.6287 19.8829 20.9141 19.8829V15.8829ZM18.3532 15.7683V17.3591H22.3532V15.7683H18.3532ZM14.2448 27.4276C14.2448 27.3441 14.2503 27.2777 14.2541 27.2396C14.2576 27.2051 14.2616 27.1762 14.2604 27.1855L18.225 27.7162C18.2251 27.7156 18.2265 27.7055 18.2279 27.694C18.2295 27.6816 18.2318 27.6623 18.2341 27.6389C18.2388 27.593 18.2448 27.5188 18.2448 27.4276H14.2448ZM14.2604 27.1855C14.2603 27.1861 14.259 27.1962 14.2575 27.2076C14.256 27.22 14.2536 27.2392 14.2513 27.2627C14.2467 27.3085 14.2406 27.3828 14.2406 27.4741H18.2406C18.2406 27.5577 18.2351 27.6242 18.2313 27.6623C18.2278 27.6968 18.2238 27.7257 18.225 27.7162L14.2604 27.1855ZM14.2406 27.4741C14.2406 30.3072 16.8713 32 19.2898 32V28C18.8902 28 18.5852 27.8643 18.4103 27.7194C18.2392 27.5776 18.2406 27.481 18.2406 27.4741H14.2406ZM19.2898 32H29.4508V28H19.2898V32ZM29.4508 32C31.8693 32 34.5 30.3072 34.5 27.4741H30.5C30.5 27.481 30.5014 27.5776 30.3303 27.7194C30.1554 27.8643 29.8505 28 29.4508 28V32ZM34.5 27.4741C34.5 27.4731 34.5 27.4525 34.4997 27.4291C34.4992 27.4038 34.4982 27.3647 34.495 27.3174C34.4887 27.2223 34.4729 27.0789 34.4278 26.9103L30.5639 27.9448C30.5229 27.7918 30.5093 27.6639 30.5039 27.5844C30.4993 27.5144 30.5 27.4553 30.5 27.4741H34.5ZM34.4869 27.2383L33.3237 15.0048L29.3417 15.3834L30.5048 27.6169L34.4869 27.2383ZM33.3243 15.0113C33.1939 13.5899 31.9709 12.7169 30.776 12.7169V16.7169C30.1545 16.7169 29.4216 16.2551 29.3411 15.3769L33.3243 15.0113ZM30.776 12.7169H28.3832V16.7169H30.776V12.7169ZM30.383 14.6843C30.33 11.4298 27.5294 9.02703 24.3703 9.02703V13.027C25.598 13.027 26.37 13.9223 26.3835 14.7494L30.383 14.6843ZM24.3703 9.02703C21.8374 9.02703 19.5811 10.5443 18.7185 12.8094L22.4566 14.233C22.7002 13.5935 23.4163 13.027 24.3703 13.027V9.02703ZM22.3571 14.7494C22.3601 14.5684 22.3946 14.3958 22.4566 14.233L18.7185 12.8094C18.495 13.3963 18.3684 14.028 18.3577 14.6843L22.3571 14.7494ZM17.9646 12.7169C16.756 12.7169 15.546 13.5988 15.4163 15.0113L19.3996 15.3769C19.3198 16.2462 18.5916 16.7169 17.9646 16.7169V12.7169ZM22.4574 12.0571L22.0658 7.93939L18.0838 8.31801L18.4753 12.4357L22.4574 12.0571ZM21.6808 14.3528C21.7435 14.0159 21.8817 13.7013 22.085 13.4211L18.8477 11.0717C18.3105 11.8118 17.9242 12.6752 17.7483 13.6215L21.6808 14.3528ZM19.2465 15.9871H19.7145V11.9871H19.2465V15.9871ZM16.7647 9.02514L17.2556 14.1768L21.2375 13.7974L20.7467 8.64576L16.7647 9.02514ZM16.4447 10.8355H18.7557V6.83545H16.4447V10.8355ZM18.4447 10.7933V8.83545H14.4447V10.7933H18.4447ZM15.7545 13.438C17.1117 13.438 18.4447 12.3825 18.4447 10.7933H14.4447C14.4447 9.92047 15.1642 9.438 15.7545 9.438V13.438ZM13.0643 10.7933C13.0643 12.3825 14.3973 13.438 15.7545 13.438V9.438C16.3448 9.438 17.0643 9.92047 17.0643 10.7933H13.0643ZM13.0643 8.83545V10.7933H17.0643V8.83545H13.0643ZM7.94214 10.8355H15.0643V6.83545H7.94214V10.8355ZM9.94214 10.7933V8.83545H5.94214V10.7933H9.94214ZM7.25191 13.438C8.6091 13.438 9.94214 12.3825 9.94214 10.7933H5.94214C5.94214 9.92047 6.66163 9.438 7.25191 9.438V13.438ZM4.56168 10.7933C4.56168 12.3825 5.89471 13.438 7.25191 13.438V9.438C7.84219 9.438 8.56168 9.92047 8.56168 10.7933H4.56168ZM4.56168 8.83545V10.7933H8.56168V8.83545H4.56168ZM4.25069 10.8355H6.56168V6.83545H4.25069V10.8355ZM4.87151 23.4603L6.24174 9.02444L2.25964 8.64646L0.889407 23.0823L4.87151 23.4603ZM5.2528 23.062C5.00315 23.062 4.8474 22.9828 4.79439 22.9427C4.77091 22.9249 4.78808 22.9309 4.81538 22.9789C4.84529 23.0315 4.87774 23.1193 4.88003 23.2299L0.880886 23.3126C0.933004 25.8317 3.36969 27.062 5.2528 27.062V23.062ZM15.7517 23.062H5.2528V27.062H15.7517V23.062ZM17.6201 26.5407L17.7427 25.2513L13.7606 24.8727L13.638 26.162L17.6201 26.5407ZM5.2528 28.3514H15.6291V24.3514H5.2528V28.3514ZM-0.5 23.2426C-0.5 26.3971 2.44605 28.3514 5.2528 28.3514V24.3514C4.65905 24.3514 4.17819 24.1503 3.87592 23.8998C3.57741 23.6525 3.5 23.4102 3.5 23.2426H-0.5ZM-0.479764 22.9486C-0.479901 22.9496 -0.481324 22.9602 -0.482819 22.9721C-0.484427 22.9849 -0.486802 23.0046 -0.4892 23.0285C-0.493894 23.0753 -0.5 23.1504 -0.5 23.2426H3.5C3.5 23.3252 3.49453 23.3908 3.4908 23.428C3.48743 23.4616 3.4835 23.4896 3.48488 23.4793L-0.479764 22.9486ZM-0.494887 23.1853C-0.494887 23.1027 -0.489421 23.0371 -0.485687 22.9999C-0.482316 22.9663 -0.478386 22.9383 -0.479764 22.9486L3.48488 23.4793C3.48502 23.4783 3.48644 23.4677 3.48793 23.4558C3.48954 23.443 3.49192 23.4233 3.49431 23.3994C3.49901 23.3526 3.50511 23.2775 3.50511 23.1853H-0.494887ZM0.945678 7.93939L-0.485908 22.996L3.49613 23.3746L4.92772 8.31801L0.945678 7.93939ZM3.62181 5.54134C2.34613 5.54134 1.08045 6.47069 0.945068 7.94593L4.92833 8.31148C4.8543 9.11817 4.18171 9.54134 3.62181 9.54134V5.54134ZM6.56679 5.54134H3.62181V9.54134H6.56679V5.54134ZM11.5058 1C7.84048 1 4.62772 3.78327 4.56706 7.50877L8.56653 7.5739C8.58767 6.27576 9.77192 5 11.5058 5V1ZM18.4445 7.50877C18.3838 3.78327 15.171 1 11.5058 1V5C13.2396 5 14.4239 6.27576 14.445 7.5739L18.4445 7.50877ZM19.3897 5.54134H16.4447V9.54134H19.3897V5.54134ZM22.0665 7.94593C21.9303 6.46181 20.6507 5.54134 19.3897 5.54134V9.54134C18.8343 9.54134 18.158 9.12705 18.0832 8.31148L22.0665 7.94593ZM17.0638 7.49591C16.9954 4.48889 14.4061 2.28934 11.5058 2.28934V6.28934C12.4809 6.28934 13.0513 6.99319 13.0648 7.58676L17.0638 7.49591ZM7.94725 9.54134H15.0643V5.54134H7.94725V9.54134ZM11.5058 2.28934C8.6054 2.28934 6.01608 4.48889 5.94777 7.49591L9.94673 7.58676C9.96022 6.99319 10.5306 6.28934 11.5058 6.28934V2.28934ZM24.3703 14.0746C24.9821 14.0746 25.2563 14.5063 25.2621 14.7623L29.2611 14.6714C29.2004 12.002 26.9073 10.0746 24.3703 10.0746V14.0746ZM23.4785 14.7623C23.4843 14.5063 23.7585 14.0746 24.3703 14.0746V10.0746C21.8333 10.0746 19.5402 12.002 19.4795 14.6714L23.4785 14.7623ZM27.2616 12.7169H21.479V16.7169H27.2616V12.7169ZM19.3533 27.6864L20.4666 15.9573L16.4845 15.5793L15.3712 27.3084L19.3533 27.6864ZM18.4756 17.7683H20.3532V13.7683H18.4756V17.7683ZM15.4169 15.0048L14.2538 27.2383L18.2358 27.6169L19.399 15.3834L15.4169 15.0048ZM20.3574 12.7169H17.9646V16.7169H20.3574V12.7169Z" fill="#ED1B2F" mask="url(#path-1-inside-1)"/>\n            </svg>',
                text: "Gerenciar seu histórico de compras"
            }, {
                icon: '<svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <path d="M28.6841 12.6284C27.721 11.8203 26.2798 11.9467 25.4732 12.908L23.305 15.4738V8.03383C23.305 7.41026 23.0457 6.8064 22.5936 6.37703L19.7001 3.62839C19.2736 3.22319 18.7146 3 18.1263 3H5.78519C4.52516 3 3.5 4.02516 3.5 5.28519V26.7152C3.5 27.9753 4.52516 29.0004 5.78519 29.0004H21.0198C22.2799 29.0004 23.305 27.9753 23.305 26.7152V22.553C23.3986 22.4421 28.9482 15.8685 28.9657 15.8479C29.7776 14.8804 29.6517 13.4404 28.6841 12.6284ZM18.7346 4.81245C21.7823 7.7075 21.5658 7.49588 21.623 7.57043H18.7346V4.81245ZM21.7815 26.7152C21.7815 27.1352 21.4398 27.477 21.0198 27.477H5.78519C5.36516 27.477 5.02344 27.1352 5.02344 26.7152V5.28519C5.02344 4.86516 5.36516 4.52344 5.78519 4.52344H17.2111V8.33208C17.2111 8.75277 17.5522 9.09382 17.9729 9.09382H21.7815V17.2765C21.4543 17.6636 18.8271 20.7725 18.5431 21.1086C18.3162 21.3789 18.153 21.7033 18.071 22.0465L17.3631 25.01C17.2961 25.2906 17.3934 25.5851 17.6144 25.7706C17.8356 25.9562 18.1425 26.0005 18.4069 25.8859L21.2025 24.6741C21.4124 24.5831 21.6082 24.4595 21.7815 24.311V26.7152ZM19.9697 21.7807L21.1366 22.7598L20.8771 23.0672C20.8016 23.1573 20.7046 23.2296 20.5967 23.2764L19.1989 23.8823L19.5529 22.4005C19.5802 22.2861 19.6346 22.178 19.7085 22.0899L19.9697 21.7807ZM22.1193 21.5957L20.953 20.6171C21.0713 20.4771 24.8987 15.9479 25.1634 15.6347L26.3273 16.6114L22.1193 21.5957ZM27.8002 14.8669L27.3102 15.4473L26.1468 14.4711L26.6385 13.8893C26.9071 13.5692 27.3855 13.5275 27.7048 13.7954C28.0304 14.0686 28.0663 14.5497 27.8002 14.8669Z" fill="#ED1B2F"/>\n            <path d="M14.9259 7.5697H7.30862C6.88793 7.5697 6.54688 7.91076 6.54688 8.33145C6.54688 8.75214 6.88793 9.0932 7.30862 9.0932H14.9259C15.3466 9.0932 15.6877 8.75214 15.6877 8.33145C15.6877 7.91076 15.3466 7.5697 14.9259 7.5697Z" fill="#ED1B2F"/>\n            <path d="M19.4963 12.1909H7.30862C6.88793 12.1909 6.54688 12.532 6.54688 12.9527C6.54688 13.3734 6.88793 13.7144 7.30862 13.7144H19.4963C19.917 13.7144 20.2581 13.3734 20.2581 12.9527C20.2581 12.532 19.917 12.1909 19.4963 12.1909Z" fill="#ED1B2F"/>\n            <path d="M19.4963 16.7614H7.30862C6.88793 16.7614 6.54688 17.1024 6.54688 17.5231C6.54688 17.9438 6.88793 18.2848 7.30862 18.2848H19.4963C19.917 18.2848 20.2581 17.9438 20.2581 17.5231C20.2581 17.1024 19.917 16.7614 19.4963 16.7614Z" fill="#ED1B2F"/>\n            <path d="M14.9259 21.3317H7.30862C6.88793 21.3317 6.54688 21.6727 6.54688 22.0934C6.54688 22.5141 6.88793 22.8552 7.30862 22.8552H14.9259C15.3466 22.8552 15.6877 22.5141 15.6877 22.0934C15.6877 21.6727 15.3466 21.3317 14.9259 21.3317Z" fill="#ED1B2F"/>\n            </svg>',
                text: "Preencher suas informações"
            }]
        },
        _isMobile: function() {
            return [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i].some((e=>navigator.userAgent.match(e)))
        },
        _isPhone: function() {
            return [/Android/i, /webOS/i, /iPhone/i, /BlackBerry/i, /Windows Phone/i].some((e=>navigator.userAgent.match(e)))
        },
        _onlyNumbers: function(e) {
            return e.replace(/\D/g, "")
        },
        _sendAttachment: function(e, t) {
            vtexjs.checkout.getOrderForm().then((()=>vtexjs.checkout.sendAttachment(e, t)))
        },
        _timeOfServer: function() {
            return $.get("/_v/app/get-time").done((e=>e))
        },
        _toTimeStamp: function(e) {
            if (!e)
                return;
            const t = e.toLowerCase().replace(/:/g, "-")
              , [n,i] = t.split("t")
              , [a,o,s] = n.split("-")
              , [r,l,c] = i.split("-");
            return new Date(`${o}/${s}/${a} ${r}:${l}:${c}`).getTime()
        },
        _lecBlockInput: function() {
            $(".seller-btn.apply").addClass("hide"),
            $(".seller-btn.remove").removeClass("hide"),
            $(".seller-input").addClass("bg-grey"),
            $(".seller-input").attr("readonly", !0)
        },
        _lecUnlockInput: function() {
            $(".seller-btn.apply").removeClass("hide"),
            $(".seller-btn.remove").addClass("hide"),
            $(".seller-input").removeClass("bg-grey"),
            $(".seller-input").attr("readonly", !1)
        },
        insertBtnFinishPayment: function() {
            "#/payment" !== window.location.hash || $(".payment-finish").length || ($("#payment-data").append('<div class="payment-finish">\n            <div class="value-payment">\n              <p id="text-pay">Total</p>\n              <p id="value-pay"></p>\n            </div>\n            <button id="pay-finish">Finalizar compra</button>\n          </div>'),
            this.insertValuePayment(),
            this.clickBtnFinishPayment())
        },
        clickBtnFinishPayment: function() {
            $("#payment-data").on("click", "#pay-finish", (function() {
                $("#payment-data-submit").trigger("click")
            }
            ))
        },
        insertValuePayment: function() {
            const e = $('.mini-cart .table .monetary[data-bind="text: totalLabel"]').text();
            $("#value-pay").text(e)
        }
    }).init()
}
));
