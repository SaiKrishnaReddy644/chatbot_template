<script>
  import Header from "./Header.svelte";
  import Messages from "./Messages.svelte";
  import ChatInput from "./ChatInput.svelte";
  import Welcome from "./Welcome.svelte";
  import { chatbotMessages, windowoption, user_token } from "../store.js";
  import { fade, fly } from "svelte/transition";
</script>

<style>
  .chatbot-container {
    height: 570px;
    width: 350px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    position: fixed;
    bottom: 0;
    right: 0;
    border-radius: 5px;
    z-index: 9999;
    margin-bottom: 20px;
    margin-right: 20px;
  }

  @media only screen and (max-width: 767px) {
    * {
      overflow: hidden;
    }
    .chatbot-container {
      overflow: hidden;
      height: 101%;
      width: 100%;
      margin: 0;
    }
  }
</style>

<div
  class="chatbot-container"
  in:fly={{ y: 1000, duration: 1500, fade }}
  out:fly={{ y: 1000, duration: 1500, fade }}>
  {#if $windowoption.welcome && localStorage.length === 0}
    <Welcome />
  {:else}
    <Header/>
    <Messages />
    <ChatInput />
  {/if}

</div>
