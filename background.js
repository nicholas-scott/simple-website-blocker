const webReg = /[((www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9]*)/

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ 'blackList': [] })
});

chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete') {
        var activeTabUrlReg = webReg.exec(tab.url)
        if(!activeTabUrlReg){
            return
        }
        var activeTabUrl = activeTabUrlReg[0]
        chrome.storage.sync.get(['blackList'], result =>  {
            var blackList = result.blackList
            //If list is blocked
            if(blackList.includes(activeTabUrl)){
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    function: () => {
                        document.body.innerHTML = ""
                        document.body.style.background = 'white'
                    },
                })
            }
        })
    }
  })

