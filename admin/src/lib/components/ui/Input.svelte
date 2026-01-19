<script lang="ts">
	export let type: string = 'text';
	export let name: string = '';
	export let label: string = '';
	export let value: any = '';
	export let placeholder: string = '';
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let error: string = '';
	export let rows: number = 3;
	export let options: { value: string; label: string }[] = [];

	const inputClasses =
		'mt-1 block w-full rounded-md border-gray-300 dark:border-DarkLightGrey shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-DarkerGrey text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800';
</script>

<div class="mb-4">
	{#if label}
		<label for={name} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	{#if type === 'textarea'}
		<textarea
			id={name}
			{name}
			{rows}
			{placeholder}
			{required}
			{disabled}
			bind:value
			class={inputClasses}
			class:border-red-500={error}
			on:input
			on:change
			on:blur
		></textarea>
	{:else if type === 'select'}
		<select
			id={name}
			{name}
			{required}
			{disabled}
			bind:value
			class={inputClasses}
			class:border-red-500={error}
			on:change
		>
			<option value="">Seçiniz...</option>
			{#each options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	{:else if type === 'checkbox'}
		<div class="flex items-center">
			<input
				id={name}
				{name}
				type="checkbox"
				{disabled}
				bind:checked={value}
				class="h-4 w-4 rounded border-gray-300 dark:border-DarkLightGrey text-blue-600 focus:ring-blue-500 dark:bg-DarkerGrey"
				on:change
			/>
			{#if placeholder}
				<label for={name} class="ml-2 block text-sm text-gray-900 dark:text-white">
					{placeholder}
				</label>
			{/if}
		</div>
	{:else if type === 'password'}
		<input
			id={name}
			{name}
			type="password"
			{placeholder}
			{required}
			{disabled}
			bind:value
			class={inputClasses}
			class:border-red-500={error}
			on:input
			on:change
			on:blur
		/>
	{:else if type === 'email'}
		<input
			id={name}
			{name}
			type="email"
			{placeholder}
			{required}
			{disabled}
			bind:value
			class={inputClasses}
			class:border-red-500={error}
			on:input
			on:change
			on:blur
		/>
	{:else if type === 'number'}
		<input
			id={name}
			{name}
			type="number"
			{placeholder}
			{required}
			{disabled}
			bind:value
			class={inputClasses}
			class:border-red-500={error}
			on:input
			on:change
			on:blur
		/>
	{:else if type === 'date'}
		<input
			id={name}
			{name}
			type="date"
			{placeholder}
			{required}
			{disabled}
			bind:value
			class={inputClasses}
			class:border-red-500={error}
			on:input
			on:change
			on:blur
		/>
	{:else}
		<input
			id={name}
			{name}
			type="text"
			{placeholder}
			{required}
			{disabled}
			bind:value
			class={inputClasses}
			class:border-red-500={error}
			on:input
			on:change
			on:blur
		/>
	{/if}

	{#if error}
		<p class="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
	{/if}
</div>
