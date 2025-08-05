<div
  role="alert"
  class="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-xl p-5 shadow-sm text-yellow-800 dark:text-yellow-100 mb-8"
>
  <div class="flex flex-1 gap-4">
    <div class="flex-shrink-0">
      <i
        class="fa fa-exclamation-triangle text-2xl text-yellow-500 dark:text-yellow-400"
      ></i>
    </div>
    <div class="flex flex-col gap-1">
      <p class="text-sm md:text-base leading-relaxed">
        <slot />
      </p>
    </div>
  </div>
</div>

