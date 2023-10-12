import { PluginWithOptions } from "markdown-it";
interface CustomInputPluginOptions {
  // Define any options for your plugin here. For now, it's empty.
}

const iconList = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clip-rule="evenodd"></path></svg>`;
const iconCheck = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z" clip-rule="evenodd"></path></svg>`;

// Function to set event listeners
export const setButtonListeners = () => {
  // Add The event listener to the button
  const buttons = document.querySelectorAll('.custom-input button');
  buttons.forEach((button: Element) => {
    button.addEventListener("click", function (e: Event) {
      const btn = e.currentTarget as HTMLButtonElement; // The button itself
      // console.log(btn)

      const input = btn.previousElementSibling as HTMLInputElement;
      if (input) {
        // console.log(input.value);
        navigator.clipboard.writeText(input.value);
      }
      // Toggle the icon to Check icon
      btn.innerHTML = iconCheck;

      // Set it back to List icon after 3 seconds
      setTimeout(() => {
        btn.innerHTML = iconList;
      }, 3000);
    });
  });
}

export const customInputPlugin: PluginWithOptions<
  CustomInputPluginOptions
> = (md, options) => {
  const inputPattern = /i::\[(\w+)\((.+)\)\]/;

  md.core.ruler.after("inline", "custom-syntax", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== "inline") continue;
      const children = tokens[i].children || [];
      for (let j = 0; j < children.length; j++) {
        if (
          children[j].type === "text" &&
          inputPattern.test(children[j].content || "")
        ) {
          const matches = (children[j].content || "").match(inputPattern);
          if (matches && matches.length === 3) {
            const type = matches[1];
            const value = matches[2];

            const div = document.createElement("div");
            div.className = "flex flex-row custom-input";

            const input = document.createElement("input");
            // input.setAttribute("value", value); // set the index as data attribute
            input.type = type;
            input.className = "text-xs w-full bg-slate-700 rounded-l py-1";
            input.defaultValue = value;
            input.value = value
            input.disabled = true;

            const btn = document.createElement("button");

            btn.innerHTML = iconList;
            btn.className =
              "p-1 border border-slate-500 bg-slate-600 border-l-0 rounded-r hover:bg-slate-700 select-NONAME";

            btn.dataset.value = value;
            
            div.append(input, btn);
            children[j].type = "html_block";
            children[j].content = div.outerHTML;
            
            return false;
          }
        }
      }
    }
    return false; // No need to continue with other rules for this token
  });
};