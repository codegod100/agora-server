// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

// these define default dynamic behaviour client-side, based on local storage preferences.
// these come from toggles in settings.ts.
const autoPull = JSON.parse(localStorage["auto-pull"] || 'true')
const autoPullExtra = JSON.parse(localStorage["auto-pull-extra"] || 'false')
// This would make sense but Hedgedoc currently steals focus on embed and I've been unable to fix it so far :).
const autoPullStoa = JSON.parse(localStorage["auto-pull-stoa"] || 'false')
const autoPullSearch = JSON.parse(localStorage["auto-pull-search"] || 'true')
const autoExec = JSON.parse(localStorage["auto-exec"] || 'true')
const pullRecursive = JSON.parse(localStorage["pull-recursive"] || 'true')
const showBrackets = JSON.parse(localStorage["showBrackets"] || 'false')

function safeJsonParse(value: string, defaultValue: any) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return defaultValue;
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  console.log("DomContentLoaded");

  // set values from storage
  (document.getElementById("ranking") as HTMLInputElement).value = localStorage["ranking"] || '';
  (document.getElementById("auto-pull") as HTMLInputElement).checked = safeJsonParse(localStorage["auto-pull"], true);
  (document.getElementById("auto-pull-search") as HTMLInputElement).checked = safeJsonParse(localStorage["auto-pull-search"], true);
  (document.getElementById("auto-pull-stoa") as HTMLInputElement).checked = safeJsonParse(localStorage["auto-pull-stoa"], false);
  (document.getElementById("render-wikilinks") as HTMLInputElement).checked = safeJsonParse(localStorage["render-wikilinks"], true);

  // bind clear button (why is this here? good question!)
  var clear = document.getElementById("clear-settings");
  clear.addEventListener("click", function () {
    console.log("clearing settings");
    localStorage.clear();
  });

  var save = document.getElementById("save-settings");
  save.addEventListener("click", function () {
    console.log("trying to save settings...")
    localStorage["ranking"] = document.getElementById("ranking").value
    localStorage["auto-pull"] = document.getElementById("auto-pull").checked
    localStorage["auto-pull-stoa"] = document.getElementById("auto-pull-stoa").checked
    localStorage["auto-pull-search"] = document.getElementById("auto-pull-search").checked
    localStorage["render-wikilinks"] = document.getElementById("render-wikilinks").checked
  });

  console.log("Autopull settings are: " + autoPull + ", " + autoPullExtra);

  // Theme toggle stuff for initial load
  const theme = document.querySelector("#theme-link");
  const toggle = document.querySelector("#theme-toggle");
  const currentTheme = localStorage.getItem("theme");
  // If the user's preference in localStorage is dark...
  if (currentTheme == "dark") {
    theme.href = "/static/css/screen-dark.css";
    toggle.innerHTML = '🌞';
  } else if (currentTheme == "light") {
    theme.href = "/static/css/screen-light.css";
    theme.innerHTML = '🌙';
  }

  // Then listen for clicks on the theme toggle button or the link text
  const ids = ['#theme-toggle', '#theme-toggle-text'];
  document.querySelectorAll(ids).forEach(element => {
    element.addEventListener('click', function () {
      console.log(`Clicked ${element.id}`);
      var theme = document.querySelector("#theme-link");
      var toggle = document.querySelector("#theme-toggle");
      if (theme.getAttribute("href") == "/static/css/screen-light.css") {
        theme.href = "/static/css/screen-dark.css";
        // this doesn't work and I don't know why, but it also doesn't seem like a priority :)
        localStorage.setItem("theme", "dark");
        toggle.innerHTML = '🌞';
      } else {
        theme.href = "/static/css/screen-light.css";
        localStorage.setItem("theme", "light");
        toggle.innerHTML = '🌙';
      }
    });
  });

  // Burger menu, where we keep settings presumably :)
  document.querySelectorAll(['#burger', '#join', '#join2']).forEach(element => {
    console.log(`Clicked ${element.id}`);
    element.addEventListener("click", function () {
      const overlay = document.getElementById('overlay');
      overlay.classList.toggle('active');
    });
  });

  // Stuff to try to react to changes in iframes.
  // The following was generated by Claude Sonnet 3.5 on 2024-11-08.
  // Function to add load listener to a single iframe
  const addIframeListener = (iframe) => {
    console.log('Adding listener to iframe:', iframe.src || 'no src');

    try {
      iframe.addEventListener('load', () => {
        console.log('Iframe load event triggered:', iframe.src);
      });
    } catch (err) {
      console.error('Error adding listener:', err);
    }
  };

  // Log initial iframes
  console.log('Initial iframes:', document.querySelectorAll('iframe').length);

  // Add listeners to existing iframes
  document.querySelectorAll('iframe').forEach(addIframeListener);

  // Watch for new iframes being added
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      console.log('Mutation detected:', mutation.type);

      mutation.addedNodes.forEach(node => {
        // console.log('Added node type: ', node.nodeName);
        if (node.nodeName === 'IFRAME') {
          console.log('Added iframe: ', node.nodeName);
          addIframeListener(node);
        }
      });
    });
  });

  // Start observing with logging
  console.log('Starting observer');
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  console.log('Observer started');
  // end code from Claude Sonnet 3.5.

  // clear mini cli on clicking clear button
  /*
  document.querySelector("#mini-cli-clear").addEventListener("click", () => {
    console.log("clearing mini-cli");
    document.querySelector("#mini-cli").value = "";
  });
  */

  document.querySelector("#mini-cli-exec").addEventListener("click", () => {
    console.log("exec mini-cli");
    let val = document.querySelector("#mini-cli").value;
    document.querySelector("#mini-cli").parentElement.submit();
  });

  document.querySelector("#mini-cli-go").addEventListener("click", () => {
    console.log("go mini-cli executes");
    let val = document.querySelector("#mini-cli").value;
    document.querySelector("#mini-cli").value = 'go/' + val;
    document.querySelector("#mini-cli").parentElement.submit();
  });

  /*
  document.querySelector("#internet-go").addEventListener("click", () => {
    console.log("go internet");
    window.location.href = 'https://google.com/search?q=' + NODEQ;
  });
  */

  // focus mini-cli on key combo
  window.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.altKey && e.keyCode == 83) {
      const miniCli = document.querySelector("#mini-cli");
      miniCli.focus();
      miniCli.value = "";
    }
  });

  // pull arbitrary URL
  document.querySelectorAll(".pull-url").forEach(element => {
    element.addEventListener('click', function (e) {
      console.log("in pull-url!");
      if (this.classList.contains('pulled')) {
        // already pulled.
        this.innerText = 'pull';
        this.nextElementSibling.remove();
        this.classList.remove('pulled');
      } else {
        // pull.
        this.innerText = 'pulling';
        let url = this.value;
        console.log('pull url : ' + url);
        const iframe = document.createElement('iframe');
        iframe.className = 'stoa2-iframe';
        iframe.setAttribute('allow', 'camera; microphone; fullscreen; display-capture; autoplay');
        iframe.src = url;
        this.after(iframe);
        this.innerText = 'fold';
        this.classList.add('pulled');
      }
    });
  });

  // pull a node from the default [[stoa]]
  document.querySelector("#pull-stoa")?.addEventListener("click", function (e) {
    console.log('clicked stoa button');
    if (this.classList.contains('pulled')) {
      // already pulled.
      this.innerText = 'pull';
      this.nextElementSibling.remove();
      document.querySelector("#stoa-iframe").innerHTML = '';
      this.classList.remove('pulled');
    } else {
      this.innerText = 'pulling';
      let node = this.value;
      document.querySelector("#stoa-iframe").innerHTML = '<iframe id="stoa-iframe" name="embed_readwrite" src="https://doc.anagora.org/' + node + '?edit"></iframe>';
      this.innerText = 'fold';
      this.classList.add('pulled');
    }
  });

  async function statusContent(self) {
    let toot = self.value;
    let domain, post;
    // extract instance and :id, then use https://docs.joinmastodon.org/methods/statuses/ and get an oembed
    // there are two kinds of statuses we want to be able to embed: /web/ led and @user led.
    const web_regex = /(https:\/\/[a-zA-Z-.]+)\/web\/statuses\/([0-9]+)/ig
    const user_regex = /(https:\/\/[a-zA-Z-.]+)\/@\w+\/([0-9]+)/ig

    console.log("testing type of presumed mastodon embed: " + toot);
    if (m = web_regex.exec(toot)) {
      console.log("found status of type /web/");
      domain = m[1];
      post = m[2];
    }
    if (m = user_regex.exec(toot)) {
      console.log("found status of type /@user/");
      domain = m[1];
      post = m[2];
    }

    req = domain + '/api/v1/statuses/' + post
    console.log('req for statusContent: ' + req)
    try {
      const response = await fetch(req);
      const data = await response.json();
      console.log('status: ' + data['url']);
      let actual_url = data['url'];

      console.log('actual url for mastodon status: ' + actual_url);
      let oembed_req = domain + '/api/oembed?url=' + actual_url;
      const oembedResponse = await fetch(oembed_req);
      const oembedData = await oembedResponse.json();
      console.log('oembed: ' + oembedData['html']);
      self.insertAdjacentHTML('afterend', oembedData['html']);
    } catch (error) {
      console.error('Error fetching Mastodon status:', error);
    }
    self.innerText = 'pulled';
  }


  // start async content code.
  setTimeout(loadAsyncContent, 10)

  async function loadAsyncContent() {

    // this loads everything from the local node down to the footer.
    // prior to this as of 2023-12-06 we render the navbar, including search box, web search and stoas.
    var content = document.querySelector("#async-content");
    var node;
    if (content != null) {
      node = content.getAttribute('src');
      console.log("loading " + node + " async");
    }
    else {
      node = NODENAME;
      console.log("loading " + node + " sync");
    }

    // give some time to Wikipedia to search before trying to pull it (if it's considered relevant here).
    setTimeout(autoPullAsync, 1000)

    // Check local storage to see if the info boxes should be hidden
    const dismissButtons = document.querySelectorAll(".dismiss-button");
    dismissButtons.forEach(button => {
      const infoBoxId = button.getAttribute("info-box-id");
      const infoBox = document.querySelector(`.info-box[info-box-id="${infoBoxId}"]`);
      // Add click event to the dismiss button

      if (localStorage.getItem(`dismissed-${infoBoxId}`) === "true") {
        infoBox.classList.add("hidden");
        infoBox.style.display = "none";
      }

      button.addEventListener("click", function () {
        const parentDiv = button.parentElement;
        parentDiv.classList.add("hidden");
        localStorage.setItem(`dismissed-${infoBoxId}`, "true");

        // Optionally, you can completely remove the element from the DOM after the transition
        parentDiv.addEventListener("transitionend", function () {
          parentDiv.style.display = "none";
        }, { once: true });

      });
    });
    // end infobox dismiss code.



    // bind stoas, search and genai early.
    var details = document.querySelectorAll("details.url");
    details.forEach((item) => {
      item.addEventListener("toggle", async (event) => {
        if (item.open) {
          console.log("Details have been shown");
          embed = item.querySelector(".stoa-iframe");
          if (embed) {
            let url = embed.getAttribute('src');
            embed.innerHTML = '<iframe allow="camera; microphone; fullscreen; display-capture; autoplay" src="' + url + '" style="width: 100%;" height="700px"></iframe>';
          }
        } else {
          console.log("Details have been hidden");
          embed = item.querySelector(".stoa-iframe");
          if (embed) {
            console.log("Embed found, here we would fold.");
            embed.innerHTML = '';
          }
        }
      });
    });

    var details = document.querySelectorAll("details.search");
    details.forEach((item) => {
      item.addEventListener("toggle", async (event) => {
        if (item.open) {
          console.log("Details have been shown");
          searchEmbed = item.querySelector(".pulled-search-embed");
          if (searchEmbed) {
            let qstr = searchEmbed.id;
            console.log("Search embed found, here we would pull.");
            response = await fetch(AGORAURL + '/fullsearch/' + qstr);
            searchEmbed.innerHTML = await response.text();
          }
        } else {
          console.log("Details have been hidden");
          searchEmbed = item.querySelector(".pulled-search-embed");
          if (searchEmbed) {
            console.log("Search embed found, here we would fold.");
            searchEmbed.innerHTML = '';
          }
        }
      });
    });

    // same for GenAI if we have it enabled.
    var genai = document.querySelectorAll("details.genai");
    genai.forEach((item) => {
      item.addEventListener("toggle", async (event) => {
        if (item.open) {
          console.log("Details for GenAI have been shown");
          genAIEmbed = item.querySelector(".pulled-genai-embed");
          if (genAIEmbed) {
            let qstr = genAIEmbed.id;
            console.log("GenAI embed found, here we would pull.");
            response = await fetch(AGORAURL + '/api/complete/' + qstr);
            genAIEmbed.innerHTML = await response.text();
          }
        } else {
          console.log("Details for GenAI have been hidden");
          genAIEmbed = item.querySelector(".pulled-genai-embed");
          if (genAIEmbed) {
            console.log("GenAI embed found, here we would fold.");
            genAIEmbed.innerHTML = '';
          }
        }
      });

    });

    if (content != null) {
      // block on node loading (expensive if the task is freshly up)
      response = await fetch(AGORAURL + '/node/' + node);
      content.outerHTML = await response.text();
    }

    setTimeout(bindEvents, 10)

  }

  async function autoPullAsync() {
    // autopull if the local node is empty.
    console.log('auto pulling resources');
    var details = document.querySelectorAll(".autopull");
    details.forEach((item) => {
      item.click();
    });
    // }
  }

  async function bindEvents() {

    // Check local storage to see if the info boxes should be hidden
    const dismissButtons = document.querySelectorAll(".dismiss-button");
    dismissButtons.forEach(button => {
      const infoBoxId = button.getAttribute("info-box-id");
      const infoBox = document.querySelector(`.info-box[info-box-id="${infoBoxId}"]`);
      // Add click event to the dismiss button

      if (localStorage.getItem(`dismissed-${infoBoxId}`) === "true") {
        infoBox.classList.add("hidden");
        infoBox.style.display = "none";
      }

      button.addEventListener("click", function () {
        const parentDiv = button.parentElement;
        parentDiv.classList.add("hidden");
        localStorage.setItem(`dismissed-${infoBoxId}`, "true");

        // Optionally, you can completely remove the element from the DOM after the transition
        parentDiv.addEventListener("transitionend", function () {
          parentDiv.style.display = "none";
        }, { once: true });

      });
    });
    // end infobox dismiss code.

    // this works and has already replaced most pull buttons for Agora sections.
    // this is for 'zippies' that require pulling (e.g. pulled nodes).
    var details = document.querySelectorAll("details.node");
    details.forEach((item) => {
      item.addEventListener("toggle", (event) => {
        if (item.open) {
          console.log("Details have been shown");
          nodeEmbed = item.querySelector(".node-embed");
          if (nodeEmbed) {
            let node = nodeEmbed.id;
            console.log("Node embed found, here we would pull.");
            nodeEmbed.innerHTML = '<iframe src="' + AGORAURL + '/' + node + '" style="max-width: 100%;" allowfullscreen="allowfullscreen"></iframe>';
          }
        } else {
          console.log("Details have been hidden");
          nodeEmbed = item.querySelector(".node-embed");
          if (nodeEmbed) {
            console.log("Node embed found, here we would fold.");
            nodeEmbed.innerHTML = '';
          }
        }
      });
    });


    // end zippies.

    document.querySelectorAll(".pushed-subnodes-embed").forEach(async function (element) {
      // auto pull pushed subnodes by default.
      // it would be better to infer this from node div id?
      let node = NODENAME;
      let arg = ARG;
      let id = ".pushed-subnodes-embed";
      console.log('auto pulling pushed subnodes, will write to id: ' + id);
      let response;
      if (arg != '') {
      response = await fetch(AGORAURL + '/push/' + node + '/' + arg);
      } else {
      response = await fetch(AGORAURL + '/push/' + node);
      }
      const data = await response.text();
      document.querySelector(id).innerHTML = data;
      // end auto pull pushed subnodes.
    });

    document.querySelectorAll(".context").forEach(async function (element) {
      // auto pull context by default.
      // it would be better to infer this from node div id?
      let node = NODENAME;
      let id = '.context';
      console.log('auto pulling context, will write to id: ' + id);
      const response = await fetch(AGORAURL + '/context/' + node);
      const data = await response.text();
      document.querySelector(id).innerHTML = data;
      console.log('auto pulled context');
      
      // Finally!

      console.log("loading graph...")
      fetch("/graph/json/" + node).then(res => res.json()).then(data => {
      const container = document.getElementById('graph');
      const currentTheme = localStorage.getItem("theme") || 'light';
      // const backgroundColor = (currentTheme == 'light' ? 'rgba(255, 255, 255, 1)' : 'rgba(50, 50, 50, 1)')
      const backgroundColor = (currentTheme == 'light' ? 'rgba(255, 255, 255, 1)' : 'rgba(50, 50, 50, 1)')
      const edgeColor = (currentTheme == 'light' ? 'rgba(100, 100, 100, 1)' : 'rgba(150, 150, 150, 1)')

      console.log('graph center:' + node)
      const Graph = ForceGraph()(container);

      if (data.nodes.length > 100) {
          // for "large" graphs, render nodes as circles.
          Graph.height(container.clientHeight)
              .width(container.clientWidth)
              .onNodeClick(node => {
                  let url = "{{config['URL_BASE']}}/" + node.id;
                  location.assign(url)
              })
              .graphData(data)
              .nodeId('id')
              .nodeVal('val')
              .nodeAutoColorBy('group')
          }
          else {
          // for "small" graphs, render nodes as labels.
              Graph.height(container.clientHeight)
              .width(container.clientWidth)
              .onNodeClick(node => {
                  let url = "{{config['URL_BASE']}}/" + node.id;
                  location.assign(url)
              })
              .graphData(data)
              .nodeId('id')
              .nodeVal('val')
              .nodeAutoColorBy('group')
              .nodeCanvasObject((node, ctx, globalScale) => {
              const label = node.name;
              var fontSize = 12/globalScale;
              if (node.id == node) {
                  fontSize = 24/globalScale;
                  }
              ctx.font = `${fontSize}px Sans-Serif`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

              ctx.fillStyle = backgroundColor;
              ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = node.color;
              ctx.fillText(label, node.x, node.y);

              node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
              })
              .linkDirectionalArrowLength(3)
              .linkColor(() => edgeColor)
              //.d3Force('collision', d3.forceCollide(node => Math.sqrt(100 / (node.level + 1)) * NODE_REL_SIZE))
              .nodePointerAreaPaint((node, color, ctx) => {
              ctx.fillStyle = color;
              const bckgDimensions = node.__bckgDimensions;
              bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
              });
          }
          Graph.zoom(3);
          Graph.cooldownTime(5000); // default is 15000ms
          Graph.onEngineStop(() => Graph.zoomToFit(400));
      });

      // fit to canvas when engine stops

      console.log("graph loaded.")
    });

  // This autoPull runs just after load of the node.
    if (autoPull) {
      console.log('auto pulling recommended (local, friendly-looking domains) resources!');
      // auto pull everything with class auto-pull by default.
      // as of 2022-03-24 this is used to automatically include nodes pulled by gardens in the Agora.
      document.querySelectorAll(".auto-pull-button").forEach(function (element) {
        console.log('auto pulling URLs, trying to press button', element);
        element.click();
      });
      var details = document.querySelectorAll(".autopull");
      details.forEach((item) => {
        console.log('auto pulling details, trying to expand' + this)
        item.click();
      });
    }
    // end async content code.

    // pull nodes from the [[agora]]
    // pull-node are high-ranking (above the 'fold' of context), .pull-related-node are looser links below.
    document.querySelectorAll(".pull-node").forEach(element => {
      element.addEventListener("click", function (e) {
      let node = this.value;

      if (this.classList.contains('pulled')) {
        // already pulled.
        document.querySelector(`#${node}.pulled-node-embed`).innerHTML = '';
        this.innerText = 'pull';
        this.classList.remove('pulled');
      } else {
        this.innerText = 'pulling';
        console.log('pulling node');
        // now with two methods! you can choose the simpler/faster one (just pulls static content) or the nerdy one (recursive) in settings.
        if (pullRecursive) {
        document.querySelector(`#${node}.pulled-node-embed`).innerHTML = `<iframe src="${AGORAURL}/embed/${node}" style="max-width: 100%;" allowfullscreen="allowfullscreen"></iframe>`;
        } else {
        fetch(`${AGORAURL}/pull/${node}`)
          .then(response => response.text())
          .then(data => {
          document.querySelector(`#${node}.pulled-node-embed`).innerHTML = data;
          });
        }
        this.innerText = 'fold';
        this.classList.add('pulled');
      }
      });
    });

    // pull arbitrary URL
    document.querySelectorAll(".pull-url").forEach(element => {
      element.addEventListener("click", function (e) {
      console.log("in pull-url!");
      if (this.classList.contains('pulled')) {
        // already pulled.
        this.innerText = 'pull';
        this.nextElementSibling.remove();
        this.classList.remove('pulled');
      } else {
        // pull.
        this.innerText = 'pulling';
        let url = this.value;
        console.log('pull url : ' + url);
        const iframe = document.createElement('iframe');
        iframe.className = 'stoa2-iframe';
        iframe.setAttribute('allow', 'camera; microphone; fullscreen; display-capture; autoplay');
        iframe.src = url;
        this.after(iframe);
        this.innerText = 'fold';
        this.classList.add('pulled');
      }
      });
    });

    document.querySelectorAll(".pull-tweet").forEach(element => {
      element.addEventListener("click", function (e) {
      if (this.classList.contains('pulled')) {
        const div = this.nextElementSibling;
        div.remove();
        this.innerText = 'pull';
        this.classList.remove('pulled');
      } else {
        this.innerText = 'pulling';
        let tweet = this.value;
        const blockquote = document.createElement('blockquote');
        blockquote.className = 'twitter-tweet';
        blockquote.setAttribute('data-theme', 'dark');
        blockquote.innerHTML = `<a href="${tweet}"></a>`;
        this.after(blockquote);
        const script = document.createElement('script');
        script.async = true;
        script.src = "https://platform.twitter.com/widgets.js";
        script.charset = "utf-8";
        this.after(script);
        this.classList.add('pulled');
        this.innerText = 'fold';
      }
      });
    });

    // pull a mastodon status (toot) using the roughly correct way IIUC.
    document.querySelectorAll(".pull-mastodon-status").forEach(element => {
      element.addEventListener("click", function (e) {
      if (this.classList.contains('pulled')) {
        const div = this.nextElementSibling;
        div.remove();
        this.innerText = 'pull';
        this.classList.remove('pulled');
      } else {
        this.innerText = 'pulling';
        statusContent(this);
        this.classList.add('pulled');
        this.innerText = 'fold';
      }
      });
    });

    // pull a pleroma status (toot) using the laziest way I found, might be a better one
    document.querySelectorAll(".pull-pleroma-status").forEach(element => {
      element.addEventListener("click", function (e) {
      let toot = this.value;
      const iframe = document.createElement('iframe');
      iframe.src = toot;
      iframe.className = 'mastodon-embed';
      iframe.style.maxWidth = '100%';
      iframe.width = '400';
      iframe.setAttribute('allowfullscreen', 'allowfullscreen');
      this.after(document.createElement('br'));
      this.after(iframe);
      const script = document.createElement('script');
      script.src = "https://freethinkers.lgbt/embed.js";
      script.async = true;
      this.after(script);
      this.innerText = 'pulled';
      });
    });

    // pull all/fold all button in main node
    document.querySelector("#pull-all")?.addEventListener("click", function (e) {
      console.log('auto pulling all!');
      document.querySelectorAll(".pull-node").forEach(element => {
      if (!element.classList.contains('pulled')) {
        console.log('auto pulling nodes');
        element.click();
      }
      });
      document.querySelectorAll(".pull-mastodon-status").forEach(element => {
      if (!element.classList.contains('pulled')) {
        console.log('auto pulling activity');
        element.click();
      }
      });
      document.querySelectorAll(".pull-tweet").forEach(element => {
      if (!element.classList.contains('pulled')) {
        console.log('auto pulling tweet');
        element.click();
      }
      });
      document.querySelectorAll(".pull-search").forEach(element => {
      if (!element.classList.contains('pulled')) {
        console.log('auto pulling search');
        element.click();
      }
      });
      document.querySelectorAll(".pull-url").forEach(element => {
      if (!element.classList.contains('pulled')) {
        console.log('auto pulling url');
        element.click();
      }
      });

      // experiment: make pull button expand all details.
      var details = document.querySelectorAll("details.related summary, details.pulled summary, details:not([open]):is(.node) summary, details.stoa > summary, details.search > summary");
      details.forEach(item => {
      console.log('trying to click details');
      item.click();
      });
    });

    // fold all button in intro banner.
    document.querySelector("#fold-all")?.addEventListener("click", function (e) {
      // Already pulled -> fold.
      document.querySelectorAll(".pull-node").forEach(element => {
      if (element.classList.contains('pulled')) {
        console.log('auto folding nodes');
        element.click();
      }
      });
      document.querySelectorAll(".pull-mastodon-status").forEach(element => {
      if (element.classList.contains('pulled')) {
        console.log('auto folding activity');
        element.click();
      }
      });
      document.querySelectorAll(".pull-tweet").forEach(element => {
      if (element.classList.contains('pulled')) {
        console.log('auto folding tweet');
        element.click();
      }
      });
      document.querySelectorAll(".pull-search").forEach(element => {
      if (element.classList.contains('pulled')) {
        console.log('auto folding search');
        element.click();
      }
      });
      document.querySelectorAll(".pull-url").forEach(element => {
      if (element.classList.contains('pulled')) {
        console.log('auto pulling url');
        element.click();
      }
      });

      // experiment: make fold button fold all details which are open.
      var details = document.querySelectorAll("details[open] > summary");
      details.forEach(item => {
      console.log('trying to click details');
      item.click();
      });
    });

    // For late rendered 'join' actions... YOLO :)
    document.querySelectorAll(['#join2']).forEach(element => {
      console.log(`Clicked ${element.id}`);
      element.addEventListener("click", function () {
        const overlay = document.getElementById('overlay');
        overlay.classList.toggle('active');
      });
    });

  }
  // end bindEvents();

  if (showBrackets) {
    elements = document.getElementsByClassName("wikilink-marker");
    console.log("should show brackets");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.display = 'inline';
    }
  }

  // go to the specified URL
  document.querySelectorAll(".go-url").forEach(element => {
    element.addEventListener("click", function () {
      let url = this.value;
      this.innerText = 'going';
      window.location.replace(url);
    });
  });

  if (autoExec) {
    console.log('autoexec is enabled')

    // commenting out as focus stealing issues are just too disruptive.
    // setTimeout(autoPullStoaOnEmpty, 5000)

    // auto pull search by default.
    document.querySelectorAll(".pull-search").forEach(function (element) {
      console.log('auto pulling search');
      element.click();
    });

    document.querySelectorAll(".context-all").forEach(function (element) {
      // auto pull whole Agora graph in /nodes.
      let id = '.context-all';
      console.log('auto pulling whole Agora graph, will write to id: ' + id);
      fetch(AGORAURL + '/context/all')
      .then(response => response.text())
      .then(data => {
        document.querySelector(id).innerHTML = data;
      });
    });

    console.log('dynamic execution for node begins: ' + NODENAME)

    // Begin Wikipedia code -- this is hacky/could be refactored (but then again, that applies to most of the Agora! :)
    const req_wikipedia = AGORAURL + '/exec/wp/' + encodeURI(NODENAME);
    console.log('req for Wikipedia: ' + req_wikipedia);
    try {
      const response = await fetch(req_wikipedia);
      const data = await response.text();
      const wikiSearchElement = document.querySelector(".wiki-search");
      if (data && wikiSearchElement) {
        wikiSearchElement.innerHTML = data;
      } else {
        console.log('got empty data from Wikipedia, hiding div');
        if (wikiSearchElement) {
          (wikiSearchElement as HTMLElement).style.display = 'none';
        }
      }
    } catch (error) {
      console.error('Error fetching Wikipedia data:', error);
    }

    // Once more for Wiktionary, yolo :)
    req_wiktionary = AGORAURL + '/exec/wt/' + encodeURI(NODENAME)
    console.log('req for Wiktionary: ' + req_wiktionary)

    try {
      const response = await fetch(req_wiktionary);
      const data = await response.text();
      const wiktionaryElement = document.querySelector(".wiktionary-search");
      if (data && wiktionaryElement) {
      wiktionaryElement.innerHTML = data;
      } else {
      console.log('got empty data from Wiktionary, hiding div');
      if (wiktionaryElement) {
        wiktionaryElement.style.display = 'none';
      }
      }
    } catch (error) {
      console.error('Error fetching Wiktionary data:', error);
    }

  }

  // This autoPull runs after load of the top level chrome, before the node is loaded.
  if (autoPull) {
    console.log('auto pulling recommended (local, friendly-looking domains) resources!');
    // auto pull everything with class auto-pull by default.
    // as of 2022-03-24 this is used to automatically include nodes pulled by gardens in the Agora.
    document.querySelectorAll(".node-header").forEach(function (element) {
      console.log('*** auto pulling node, trying to activate', element);
      element.click();
    });
    }

  if (autoPullExtra) {
    console.log('auto pulling external resources!');
    document.querySelectorAll(".pull-mastodon-status").forEach(function (element) {
      console.log('auto pulling activity');
      element.click();
    });
    document.querySelectorAll(".pull-tweet").forEach(function (element) {
      console.log('auto pulling tweet');
      element.click();
    });
    document.querySelectorAll(".pull-related-node").forEach(function (element) {
      console.log('auto pulling related node');
      element.click();
    });
    document.querySelectorAll(".pull-url").forEach(function (element) {
      console.log('auto pulling url');
      element.click();
    });
    document.querySelectorAll(".pull-node").forEach(function (element) {
      console.log('auto pulling node');
      element.click();
    });
    }

});
