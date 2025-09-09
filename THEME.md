# Theme

This project uses Tailwind CSS with a custom theme.

- **Font family**: `Nunito`, falling back to system sans fonts.
- **Brand colors**:
  - `brand-100`: `#FFE3DC`
  - `brand-500`: `#FFA69E`
  - `brand-600`: `#E76F51`
- **Border radius**: default `0.5rem` for rounded components.

## Usage

Include the generated `tailwind.css` on any page:

```html
<link rel="stylesheet" href="./tailwind.css" />
```

Rebuild the stylesheet after changing theme tokens:

```sh
npx tailwindcss -i input.css -o tailwind.css --minify
```

Future pages like `settings.html` can reuse these classes to maintain a consistent look and feel.
