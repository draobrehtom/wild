
/*
    Menu Functions
    ==============

    CreateMenu(strMenuId, strMenuTitle)
    OpenMenu(strMenuId, bOpen)
    SetElementTextByClass(strMenuId, strClass, strText)
    SetElementTextById(strMenuId, strId, strText)
    CreatePage(strPageId, iType)
    IsAnyMenuOpen()
*/

function IsRedM()
{
    return (typeof GetParentResourceName != 'undefined') ? true : false
}       

function SetVisible(bVisible) 
{
    if (IsAnyMenuOpen()) {
        //console.log("Menus are open");
       // return;

    }

    if (bVisible)
    {
        document.body.style.visibility = "visible";
    }
    else
    {
        setTimeout(function(){
            if (!document.body.classList.contains("visible"))
            {
                document.body.style.visibility = "hidden";
            }
        }, 1000);
    }

    if (bVisible) 
    {
        document.body.classList.add("visible");
    }
    else
    {
        document.body.classList.remove("visible");
    }
}



var menus = [];
var activeMenu = "";
var currentMenuId = "";
var bMenuLock = false

function CreateMenu(strMenuId, strMenuTitle)
{
    if (typeof menus[strMenuId] != "undefined")
    {
        return; // Existing menu
    }

    menus[strMenuId] = { 
        pages: [],
        root: "",
        currentPage: ""
    }

    var menuDiv = document.createElement("DIV");
    menuDiv.classList.add("menu");
    menuDiv.id = 'menu_' + strMenuId;

    var menuBgDiv = document.createElement("DIV");
    menuBgDiv.classList.add("menuBg");
    menuDiv.appendChild(menuBgDiv);

    var menuBodyDiv = document.createElement("DIV");
    menuBodyDiv.classList.add("menuBody");
    menuDiv.appendChild(menuBodyDiv);

    // Menu Body
    {
        var menuHeaderDiv = document.createElement("DIV");
        menuHeaderDiv.classList.add("menuHeader");
        menuBodyDiv.appendChild(menuHeaderDiv);

        // Header 
        {
            var menuHeaderH1 = document.createElement("H1");
            menuHeaderH1.innerText = strMenuTitle;
            menuHeaderDiv.appendChild(menuHeaderH1);
        }

        // Subtitle 
        {
            var menuSubtitle = document.createElement("H2");
            menuSubtitle.classList.add("menuSubtitle");
            menuSubtitle.innerText = "";
            menuBodyDiv.appendChild(menuSubtitle);
        }

        // Top Scroller Line
        {
            var menuScrollerTopDiv = document.createElement("DIV");
            menuScrollerTopDiv.classList.add("menuScrollerTop");
            menuScrollerTopDiv.appendChild(document.createElement("DIV"))
            menuScrollerTopDiv.appendChild(document.createElement("DIV"))
            menuScrollerTopDiv.appendChild(document.createElement("DIV"))
            menuBodyDiv.appendChild(menuScrollerTopDiv);            
        }

        // Main Area (Page Container)
        {
            var menuBodyMainAreaDiv = document.createElement("DIV");
            menuBodyMainAreaDiv.classList.add("menuBodyMainArea");
            menuBodyDiv.appendChild(menuBodyMainAreaDiv);

            menus[strMenuId].mainAreaElement = menuBodyMainAreaDiv;

            menuBodyMainAreaDiv.addEventListener("scroll", UpdateOverflowArrow);

            /* Menu items go here */
        }

        // Bottom Scroller Line
        {
            var menuScrollerBottomDiv = document.createElement("DIV");
            menuScrollerBottomDiv.classList.add("menuScrollerBottom");
            menuScrollerBottomDiv.appendChild(document.createElement("DIV"))
            menuScrollerBottomDiv.appendChild(document.createElement("DIV"))
            menuScrollerBottomDiv.appendChild(document.createElement("DIV"))
            menuBodyDiv.appendChild(menuScrollerBottomDiv);            
        }

        // Detail Pane
        {
            var menuDetailDiv = document.createElement("DIV");
            menuDetailDiv.classList.add("menuDetail");
            menuBodyDiv.appendChild(menuDetailDiv);            
        }

        // Bottom Desc
        {
            var menuItemDescriptionDiv = document.createElement("DIV");
            menuItemDescriptionDiv.classList.add("menuItemDescription");
            menuItemDescriptionDiv.innerText = "Select to create a faction";//"Select to create a faction";
            menuBodyDiv.appendChild(menuItemDescriptionDiv);
        }
    }

    document.body.appendChild(menuDiv)
}

function OpenMenu(strMenuId, bOpen)
{
    // Close active menu
    if (activeMenu!="" && activeMenu.classList.contains("visible"))
    {
        activeMenu.classList.remove("visible");

        let menuDiv = activeMenu;
        setTimeout(function(){
            if (!menuDiv.classList.contains("visible"))
            {
                menuDiv.style.display = "none";
            }

            activeMenu = "";
        }, 1000);
    }

    if (!bOpen) return; 

    // Opening 

    currentMenuId = strMenuId;
    activeMenu = document.getElementById("menu_" + strMenuId);
    activeMenu.style.display = "block";


    if (menus[strMenuId].root != "")
    {
        GoToPage(strMenuId, menus[strMenuId].root)
    }
    else
    {
        // No root page, open the first page in the list
        for (var key in menus[strMenuId].pages) {
            GoToPage(strMenuId, key)
            break;
        }
        
    }

    setTimeout(function(){
        activeMenu.classList.add("visible");
    }, 1);       
}

function SetElementTextByClass(strMenuId, strClass, strText)
{
    let el = document.querySelector(`#menu_${strMenuId} .${strClass}`);
    el.innerText = strText;
}

function SetElementTextById(strMenuId, strId, strText)
{
    let el = document.getElementById(strMenuId + "_" + strId);
    el.innerText = strText;                
}

function CreatePage(strMenuId, strPageId, iType, iDetailPanelSize)
{
    if (typeof menus[strMenuId] == "undefined")
    {
        console.log("Error: non-existent parent menu");
        return; // non-existent parent menu
    }

    var pageDiv = document.createElement("DIV");

    menus[strMenuId]["pages"][strPageId] = {
        element: pageDiv,
        detailPanelSize: iDetailPanelSize,
        items: [],
        selectedItem: undefined
    }

    var mainArea = menus[strMenuId].mainAreaElement;

    // Detail Panel Size (safe values: 0-12)

    if (iDetailPanelSize > 12)
        iDetailPanelSize = 12;
    else if (iDetailPanelSize < 0)
        iDetailPanelSize = 0;
    
    // 55 = menuItem height
    mainArea.style.height = (55 * (13 - iDetailPanelSize)) + "px"

    menus[strMenuId].mainAreaElement.appendChild(pageDiv);
}

function SetMenuRootPage(strMenuId, strPageId)
{
    menus[strMenuId]["root"] = strPageId;
}

function GoToPage(strMenuId, strPageId)
{
    var currentPage = menus[strMenuId].currentPage;
    if (currentPage != "") // Hide current page
    {
        let currentPageElement = menus[strMenuId]["pages"][currentPage].element;
        currentPageElement.style.display = "none";
    }

    // Set the page as current
    currentPage = strPageId;
    menus[strMenuId].currentPage = strPageId;

    // Display it
    let currentPageElement = menus[strMenuId]["pages"][currentPage].element;
    currentPageElement.style.display = "block";

    let page = menus[strMenuId].pages[currentPage];

    if (page.selectedItem == undefined)
    {
        SelectPageItem(strMenuId, currentPage, page.items[0].id)
    }

    UpdateOverflowArrow();
}

function CreatePageItem(strMenuId, strPageId, strItemId, extraItemParams)
{
    let page = menus[strMenuId]["pages"][strPageId];

    let itemDiv = document.createElement("DIV");
    itemDiv.classList.add("menuItem");

    let id = (strItemId != 0 && strItemId != "") ? strItemId : page.items.length;

    itemDiv.id = `menu_${strMenuId}_item_${id}`;

    {
        // Menu Item Content
        var itemContentDiv = document.createElement("DIV");
        itemContentDiv.innerText = extraItemParams.text;
        itemDiv.appendChild(itemContentDiv);
    }

    itemDiv.addEventListener("mouseenter", (evt)=>{
        SelectPageItem(strMenuId, strPageId, id);
    });

    page.items.push({
        id: id,
        element: itemDiv,
        extra: extraItemParams,
        callback: null
    });

    page.element.appendChild(itemDiv);            
}

function SelectPageItem(strMenuId, strPageId, strItemId)
{
    let page = menus[strMenuId]["pages"][strPageId];
    let element = undefined;
    let itemIndex = 0;

    for (var i=0; i<page.items.length; i++)
    {
        if (page.items[i].id == page.selectedItem)
        {
            page.items[i].element.classList.remove("selected");
            itemIndex = i;
        }

        if (page.items[i].id == strItemId)
        {
            element = page.items[i].element;
            element.classList.add("selected");
        }
    }

    page.selectedItem = strItemId;

    // Scroll if not visible (list menus only)

    var mainAreaCont = element.parentElement.parentElement;

    var upperBound = mainAreaCont.scrollTop;
    var lowerBound = upperBound + mainAreaCont.offsetHeight;

    var elementTop = element.offsetTop;
    var elementBottom = elementTop + element.offsetHeight;

    var bElementIsVisible = (elementTop >= upperBound && elementBottom <= lowerBound);
   
    if (bElementIsVisible == false)
    {
        var scrollAmount = (elementBottom >= lowerBound) ? elementBottom-lowerBound : elementTop-upperBound;

        mainAreaCont.scrollTo({
            top: mainAreaCont.scrollTop+scrollAmount,
            behavior: "smooth",
        });
    }

    // Update description (under detail pane)
    let descElement = document.querySelector(`#menu_${strMenuId} .menuItemDescription`);
    let descTxt = page.items[itemIndex].extra.description;

    if (descTxt != undefined)
        descElement.innerText = page.items[itemIndex].extra.description;
    else
        descElement.innerText = "";
}

function UpdateOverflowArrow()
{
    let menu = menus[currentMenuId]
    if (menu == undefined)
        return;

    var currentPage = menu.currentPage;       
    let page = menu["pages"][currentPage];

    if (page == undefined)
        return

    let mainAreaCont = document.querySelector(`#menu_${currentMenuId} .menuBodyMainArea`);    

    var upperBound = mainAreaCont.scrollTop;
    var lowerBound = upperBound + mainAreaCont.offsetHeight;

    // Update scroll overflow arrow
    var bItemsBeforeClipped = false;
    var bItemsAfterClipped = false;

    for (var i=0; i<page.items.length; i++)
    {
        var el = page.items[i].element;
        var elTop = el.offsetTop;
        var elBottom = elTop + el.offsetHeight;
        
        if (!(elTop >= upperBound && elBottom <= lowerBound)) // not in bounds
        {
            if (elTop < upperBound)
                bItemsBeforeClipped = true;

            if (elTop > lowerBound) 
                bItemsAfterClipped = true;

            if (bItemsBeforeClipped && bItemsAfterClipped)
                break;
        }
    }

    let menuScrollerTop = document.querySelector(`#menu_${currentMenuId} .menuScrollerTop`);
    let menuScrollerBottom = document.querySelector(`#menu_${currentMenuId} .menuScrollerBottom`);

    if (bItemsBeforeClipped)
        menuScrollerTop.classList.add("arrow");
    else
        menuScrollerTop.classList.remove("arrow");

    if (bItemsAfterClipped)
        menuScrollerBottom.classList.add("arrow");
    else
        menuScrollerBottom.classList.remove("arrow");
}

function MoveSelection(bForward)
{ 
    let menu = menus[currentMenuId]
    if (menu == undefined)
        return;

    var currentPage = menu.currentPage;       
    let page = menu["pages"][currentPage];

    if (page == undefined)
        return

    let items = page.items;

    let itemToSelect = undefined;

    if (page.selectedItem == undefined)
    {
        itemToSelect = page.items[0].id;
    }
    else
    {
        for (var i=0; i<page.items.length; i++)
        {
            if (page.items[i].id == page.selectedItem)
            {
                var index = (bForward) ? i+1 : i-1;

                
                if (page.items[index] == undefined)
                {
                    index = (bForward) ? 0 : page.items.length-1;
                }

                itemToSelect = page.items[index].id;
                break;
            }
        }    
    }
    
    SelectPageItem(currentMenuId, currentPage, itemToSelect);    
    
    if (IsRedM())
    {
        if (bForward)
            fetch(`https://${GetParentResourceName()}/playNavDownSound`);
        else
            fetch(`https://${GetParentResourceName()}/playNavUpSound`);
    }
}

function SetPageItemExtraParams(strMenuId, strPageId, strItemId, extraItemParams)
{
}

function IsAnyMenuOpen()
{
    return (activeMenu!="" && activeMenu.classList.contains("visible"))
}

window.addEventListener("load", (event) => {
    if (!IsRedM())
    {
        
        document.body.classList.add("not-redm")

        document.getElementById("moneyDollars").innerText = "0";
        document.getElementById("moneyCents").innerText = "00";

        SetVisible(true);

        setTimeout(function(){
            //SetVisible(false);
        }, 1000);
    }
});


if (IsRedM())
{
    // 4K fix
    var x = (window.screen.width / 1920);
    document.body.style.zoom = x;
}
else
{
    //window.GetParentResourceName = () => { return "wild-core"; }

    // Simulate RedM zoom for chrome
    document.body.style.zoom = window.screen.width / 1920;

    CreateMenu("onlineMenu", "CRAFTING\n UPGRADES");
    SetElementTextByClass("onlineMenu", "menuSubtitle", "Not in faction")
    CreatePage("onlineMenu", "root", 0, 4);
    SetMenuRootPage("onlineMenu", "root");
    
    for (var i=0; i < 20; i++) {
        var params = {};
        params.text = `Menu Item #${i}`;
        //params.description = `Some description #${i}`;

        CreatePageItem("onlineMenu", "root", 0, params);
    }
    
    OpenMenu("onlineMenu", true);

    setTimeout(function(){
        //OpenMenu("debug1", false);
    }, 1000);
    
}

window.addEventListener('message', function(event) {

    if (event.data.cmd == "ping")
    {
        console.log("Ping received.")
    }


    if (event.data.cmd == "setVisibility")
    {
        SetVisible(event.data.visible);
    }

    if (event.data.cmd == "setMoneyAmount")
    {

        let USDollar = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        var money = USDollar.format(event.data.amount).replace('$','');
        money = money.split(".");

        document.getElementById("moneyDollars").innerText = money[0];
        document.getElementById("moneyCents").innerText = money[1];
    }

    if (event.data.cmd == "createMenu")
    {
        CreateMenu(event.data.menuId, event.data.menuTitle);
    }

    if (event.data.cmd == "openMenu")
    {
        OpenMenu(event.data.menuId, event.data.open);
    }

    if (event.data.cmd == "setElementTextByClass")
    {
        SetElementTextByClass(event.data.menuId, event.data.class, event.data.text);
    }

    if (event.data.cmd == "setElementTextById")
    {
        SetElementTextById(event.data.menuId, event.data.id, event.data.text);
    }

    if (event.data.cmd == "createPage")
    {
        CreatePage(event.data.menuId, event.data.pageId, event.data.type, event.data.detailPanelSize);
    }

    if (event.data.cmd == "setMenuRootPage")
    {
        SetMenuRootPage(event.data.menuId, event.data.pageId);
    }

    if (event.data.cmd == "createPageItem")
    {
        CreatePageItem(event.data.menuId, event.data.pageId, event.data.itemId, event.data.extraItemParams);
    }

    if (event.data.cmd == "moveSelection")
    {
        MoveSelection(event.data.forward);
    }
});


document.onkeydown = function(evt) {
    switch (evt.key) {
    case 'Escape':
        fetch(`https://${GetParentResourceName()}/closeAllMenus`);
        break;

    case 'ArrowDown':
        MoveSelection(true)
        break;
    case 'ArrowUp':
        MoveSelection(false)
        break;    
    }
};

document.addEventListener("wheel", (evt) => {
    MoveSelection((evt.deltaY/100)+1)
});