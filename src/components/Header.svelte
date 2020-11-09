<script>
  import { chatbotMessages, windowoption } from "../store.js";
  function closebutton() {
    windowoption.setWindow();
  }

  function reset() {
    localStorage.setItem("chatbot_messages", "[]");
    chatbotMessages.reset();
  }
</script>

<style>
  .header {
    height: 8%;
    padding: 10px;
    display: flex;
    background: #2962ff;
    justify-content: space-between;
    align-items: center;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
  }

  .reset {
    border: none;
    background: transparent;
    font-size: 20px;
    margin-top: 8px;
    font-weight: 500;
    color: #fff;
  }
  .closebutton {
    border: none;
    background: transparent;
    font-weight: 800;
    margin-top: 0px;
    font-size: 30px;
    padding: 10px;
    color: white;
    text-align: center;
    border-radius: 50%;
  }

  .options {
    display: flex;
  }
</style>

<div class="header">
  <div class="icon">
    <!-- <img
      height="30"
      width="100"
      alt="companyicon"
      class="logo"
      src="https://firstmd.ai/images/firstmdai.png" /> -->
  </div>
  <div class="options">
    <button class="reset" on:click={reset}>Reset</button>
    <!-- <div class="closebutton">
      <i class="fas fa-qrcode" />
    </div> -->
    <div class="closebutton" on:click={closebutton}>
      <i class="far fa-times-circle" />
    </div>

  </div>
</div>
