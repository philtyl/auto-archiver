// (window as any).global = window;

import { environment } from './environments/environment';
import ResourceType = chrome.declarativeNetRequest.ResourceType;
// import { snapshot } from 'archivetoday';

// const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36';
// let siteList: { [id: number]: { raw: string, regex: RegExp } } = {};

// const storageCache = {};

// const initStorageCache = getAllStorageSyncData()
//   .then(data => Object.assign(storageCache, data))
//   .catch(err => console.error(`Failed to initialize storage: ${JSON.stringify(err)}`));
//
// function getAllStorageSyncData() {
//   return new Promise((resolve, reject) => {
//     // chrome.storage.sync.get(Object.keys(environment.storageKeys), (result) => {
//     //   console.debug(`Retrieving All Storage Data: '${JSON.stringify(result)}'`);
//     //   if (chrome.runtime.lastError) {
//     //     return reject(chrome.runtime.lastError);
//     //   }
//     //   resolve(result);
//     // });
//     chrome.storage.sync.get(environment.storageKeys.siteList, (result) => {
//       siteList = (result[environment.storageKeys.siteList] || []).map((entry: string) => new RegExp(entry.replace(/\*/g, '.*?')));
//       console.log(`Retrieved SiteList: ${JSON.stringify(siteList)}`);
//     })
//   });
// };

// function getRedirect(url: string): Promise<BlockingResponse | undefined> {
//   return new Promise((resolve, reject) => {
//     chrome.storage.sync.get(environment.storageKeys.siteList, (store) => {
//       if (chrome.runtime.lastError) {
//         return reject(chrome.runtime.lastError);
//       }
//       const siteList: RegExp[]  = (store[environment.storageKeys.siteList] || []).map((entry: string) => new RegExp(entry.replace(/\*/g, '.*?')));
//       console.log(`Retrieved SiteList: ${JSON.stringify(siteList)}`);
//       resolve(siteList.some((pattern) => pattern.test(url))
//               ? { redirectUrl: 'https://google.com/' }
//               : undefined);
//     });
//   });
// }

// chrome.tabs.executeScript({
//   file: `/runtime.js`,
//   runAt: 'document_end'
// }, () => console.log('inject runtime'));

function parseSiteList(siteListRaw: string[]): { [id: number]: { raw: string, regex: RegExp } } {
  console.log(`raw sitelist: ${JSON.stringify(siteListRaw)}`);
  return Object.assign({}, (siteListRaw || [])
    .map((entry: string) => ({
      raw: entry,
      regex: new RegExp(entry.replace(/\./g, '\\.').replace(/\*/g, '.*?'))
    })));
}

// chrome.storage.sync.get(environment.storageKeys.siteList, list => {
//   console.log('on load sitelist');
//   console.log(`current value ${JSON.stringify(list)}`);
//   parseSiteList(list[environment.storageKeys.siteList]);
// });

// chrome.storage.onChanged.addListener(newState => {
//   console.log('state change detected');
//   const siteListChange = newState[environment.storageKeys.siteList];
//   console.log(`site list new val ${JSON.stringify(siteListChange.newValue)}`);
//   parseSiteList(siteListChange.newValue);
// });

// chrome.runtime.onInstalled.addListener((reason) => {
//   console.log('started');
// });

chrome.webRequest.onBeforeRequest.addListener((details) => {
  console.log(`web nav starting: ${details.url}`);
  if (!details.url.includes(environment.host)) {
    chrome.storage.sync.get(environment.storageKeys.siteList, list => {
      console.log('on load sitelist');
      console.log(`current value ${JSON.stringify(list)}`);
      const siteList = parseSiteList(list[environment.storageKeys.siteList]);
      const entryId = (Object.keys(siteList)).find(id => siteList[parseInt(id)].regex.test(details.url));
      if (!!entryId) {
        console.log('web matches pattern');
        chrome.tabs.update({ url: `${environment.host}/?url=${details.url}` }).then(() => console.log('moving to archive'));
        // chrome.declarativeNetRequest.updateSessionRules({
        //   addRules: [
        //     {
        //       id: parseInt(entryId) + 1000,
        //       action: {
        //         redirect: {
        //           url: `${environment.host}/${details.url}`
        //         },
        //         type: chrome.declarativeNetRequest.RuleActionType.REDIRECT
        //       },
        //       condition: {
        //         urlFilter: details.url,
        //         resourceTypes: [ ResourceType.MAIN_FRAME ]
        //       }
        //     }
        //   ],
        //   removeRuleIds: [ parseInt(entryId) + 1000 ]
        // }).then(() => chrome.tabs.update({ url: `${environment.host}/${details.url}` }));
      }
    });
  }
}, {
  urls: ['<all_urls>'],
  types: ['main_frame']
});


// chrome.storage.sync.get(environment.storageKeys.siteList, (store) => {
//   const siteList: RegExp[] = (store[environment.storageKeys.siteList] || []).map((entry: string) => new RegExp(entry.replace(/\*/g, '.*?')));
//   console.log(`Retrieved SiteList: ${JSON.stringify(siteList)}`);
//   if (siteList.find((pattern) => pattern.test(details.url))) {
//     return { redirectUrl: 'https://google.com/' };
//     // snapshot({ url: details.url }).then(snap => { redirectUrl: snap.url });
//   }
// });
