<script>
  import "../app.css";
</script>

<slot />

<div id="alert" class="hidden w-auto md:min-w-[200px] toast toast-end">
  <div class="alert shadow-lg bg-white text-gray-900 border border-gray-700">
    <div>
      <span id="alert-message"></span>
    </div>
  </div>
</div>