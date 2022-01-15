var account = "demo.eth";
var chain_id = "0x1";
var covalent_key = "ckey_9e3e88c3bc2949e19ba169dc7ae";
var items;

const red = "red";
const green = "#17D346";
const networks = {
    "0x1": "ETH Mainnet",
    "0x3": "Ropsten",
    "0x4": "Rinkeby",
    "0x89": "Polygon",
    "0xa86a": "Avalanche"
}
const chain_ids = {
    "0x1": "1",
    "0x3": "3",
    "0x4": "4",
    "0x89": "137",
    "0xa86a": "43114"
}

window.addEventListener("load", function() {
    if (typeof window.ethereum !== "undefined") {
        getAccount();
    } else {
        setAccountStatus("Not connected", red);
    }
});

document.getElementById("connect-metamask").addEventListener("click", function() {
    if (typeof window.ethereum !== "undefined") {
        getAccount();
    } else {
        setAccountStatus("Not connected", red);
        alert("Please install MetaMask");
    }
});

async function getAccount() {
    try {
        let accounts = await ethereum.request({method: "eth_requestAccounts"});
        account = accounts[0];
        setAccountStatus(account, green);
        setNetwork();
        ethereum.on('chainChanged', (_chainId) => window.location.reload());
    } catch(error) {
        setAccountStatus("Not connected", red);
    }
}

function setAccountStatus(status, color) {
    document.getElementById("account-status").innerHTML = "Account: " + status;
    document.getElementById("account-status-icon").style.backgroundColor = color;
    document.getElementById("account-status-icon").style.boxShadow = "0px 0px 10px 1px " + color;
}

async function setNetwork() {
    chain_id = await ethereum.request({method: "eth_chainId"});
    if (Object.keys(networks).includes(chain_id)) {
        document.getElementById("network").innerHTML = "Network: " + networks[chain_id];
    } else {
        document.getElementById("network").innerHTML = "Network: " + chain_id;
    }

    loadInventory();
}

function loadInventory() {
    if (Object.keys(chain_ids).includes(chain_id)) {
        let url = "https://api.covalenthq.com/v1/" + chain_ids[chain_id] + "/address/" + account + "/balances_v2/?nft=true&key=" + covalent_key;
        fetch(url, {method: "GET"}).then(response => response.json()).then((data) => {
            items = data.data.items;
            console.log(items);
            let nft_counter = 0;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                if (item.type === "nft" && item.nft_data && item.nft_data.length > 0) {

                    for(let j = 0; j < item.nft_data.length; j++) {
                        if(item.nft_data[0].external_data.image) {
                            addElement(i, item.nft_data[j].external_data.image, nft_counter, item.nft_data[j].external_data.name);
                            nft_counter += 1;
                        }
                    }
                }
            }

            let spacer = document.createElement("div");
            spacer.style.height = "100px";
            spacer.style.position = "absolute";
            spacer.style.top = ((Math.floor(nft_counter/4) * 160) + 140).toString() + "px";
            spacer.style.width = "100%";
            spacer.style.left = "0px";
            document.getElementById("inventory").appendChild(spacer);
        });
    }
}

function addElement(index, url, i, name) {
    console.log(index.toString() + " " + url);

    let div = document.createElement("div");
    let id = "pixel-" + index.toString() + i.toString();
    div.setAttribute("id", id);
    div.classList.add("item");
    div.style.left = ((i % 4) * 160).toString() + "px";
    div.style.top = (Math.floor(i/4) * 160).toString() + "px";
    let img = document.createElement("img");
    img.setAttribute("src", url);
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.borderRadius = "4px";
    img.setAttribute("title", name);
    div.appendChild(img);

    div.addEventListener("click", function() {
        document.getElementById(id).classList.toggle("checked");
    });

    document.getElementById("inventory").appendChild(div);
}