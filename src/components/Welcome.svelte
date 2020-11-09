<style>
  .container {
    height: 100%;
    widows: 100%;
    display: flex;
    padding: 20px;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
  }

  h6 {
    font-size: 24px;
  }
  p {
    font-size: 14px;
    padding:10px;
  }

  button {
    border: none;
    box-shadow: 0px 0px 5px rgb(0, 0, 0,0.3);
    color:white;
    border-radius:20px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 25px;
    padding-right: 25px;
    background-color:#2962ff;
  }
</style>

<div class="container">
  <h6>Welcome I am So and so</h6>
  <p>
    It is a long established fact that a reader will be distracted by the
    readable content of a page when looking at its layout. The point of using
    Lorem Ipsum is that it has a more-or-less normal distribution of letters, as
    opposed to using 'Content here, content here', making it look like readable
    English.
  </p>
  <button on:click={openchat}>Get Started</button>
</div>

<script>
 import {windowoption} from '../store'

 function openchat(){
     windowoption.openchat()
 }
</script>