<script>
  import ChatIcon from "./icons/ChatIcon.svelte";
  import ChatWindow from "./components/ChatWindow.svelte";
  import { user_token, windowoption } from "./store.js";

  let urldata = window.location.href.split("/");

  let htmlpage = urldata[urldata.length - 1].split("?")[0];

  if (htmlpage === "") {
    htmlpage = "/";
  }

  let openbutton, chatwindow;
  let token
  let data = getParams(urldata[urldata.length - 1]);

  if (data["user_token"]) {
    token = data["user_token"]
    user_token.update(data => {
      data.token = data["user_token"];
      return data;
    });
  } else {
    data = undefined;
  }
  function openchatwindow() {
    windowoption.setWindow();
  }

  function getParams(str) {
    var queryString = str || window.location.search || "";
    var keyValPairs = [];
    var params = {};
    queryString = queryString.replace(/.*?\?/, "");
    if (queryString.length) {
      keyValPairs = queryString.split("&");
      for (let pairNum in keyValPairs) {
        var key = keyValPairs[pairNum].split("=")[0];
        if (!key.length) continue;
        if (typeof params[key] === "undefined") params[key] = [];
        params[key].push(keyValPairs[pairNum].split("=")[1]);
      }
    }
    return params;
  }

  console.log(token)
</script>

<style>
  .open-button {
    position: fixed;
    height: 60px;
    width: 60px;
    bottom: 0;
    right: 0;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 50%;
    background: #2962ff;
    display: flex;
    border: none;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.7);
  }

  .invalidtoken {
    margin: auto;
    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 35px;
    justify-content: center;
    align-items: center;
  }
</style>

<main>
  {#if htmlpage === 'demo.html'}

    {#if $windowoption.chatwindow}
      <ChatWindow />
    {/if}

    {#if $windowoption.openbutton}
      <button class="open-button" on:click={openchatwindow}>
        <ChatIcon />
      </button>
    {/if}

  {:else if (htmlpage === 'index.html' || htmlpage === '/') && token !== undefined}
    {#if $windowoption.chatwindow}
      <ChatWindow />
    {/if}

    {#if $windowoption.openbutton}
      <button class="open-button" on:click={openchatwindow}>
        <ChatIcon />
      </button>
    {/if}

  {:else}

    <div class="invalidtoken">
      <h6>Invalid token</h6>
    </div>
  {/if}
</main>
