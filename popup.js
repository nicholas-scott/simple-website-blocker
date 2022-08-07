const websiteHeader = document.getElementById('url-text')
const blockButton = document.getElementById('block-button')
const websiteBody = document.getElementsByTagName('body')[0]
const webReg = /[((www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9]*)/ 

const innitMain =  () => {
    //Get current page
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        // must be var so it can be accessed in blackList callback 
        // Sets the header to be website url without 
        var activeTab = tabs[0];
        var activeTabUrl = webReg.exec(activeTab.url)[0]
        websiteHeader.innerText = activeTabUrl
        
        //Get blackList 
        chrome.storage.sync.get(['blackList'], result => {
            var blackList = result.blackList

            let isBlocked = blackList.includes(activeTabUrl)
            
            // set button text appropriately 
            let updateBlackList = null 
            let onButtonPressText = ""

            if(isBlocked){
                blockButton.innerText = 'UnBlock'
                onButtonPressText = 'Unblocking this site...'
                updateBlackList = () => {
                    blackList = blackList.filter(word => {
                        word !== activeTabUrl
                    })
                }
            }
            else{
                blockButton.innerText = 'Block'
                onButtonPressText = 'Blocking this site...'

                updateBlackList = () => {
                    blackList.push(activeTabUrl)
                }
            }   

            // Attach event listener 
            blockButton.addEventListener("click", () => {
                updateBlackList()

                chrome.storage.sync.set({'blackList': blackList}, () => {
                    blockButton.innerText = onButtonPressText
                    blockButton.disabled = true

                    //Timeout is so page doesn't load right away
                    setTimeout(() =>{
                        // Reload current page and close popup
                        chrome.tabs.reload(activeTab.id)
                        window.close();
                    }, 2000)
                })
            })
        })
    })
}

innitMain()


