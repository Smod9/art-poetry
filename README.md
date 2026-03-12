# Magic Words

Magic Words is a single-page React + TypeScript poetry toy for kids. Children type short poems, press play, and special words like `splash`, `twinkle`, `rainbow`, or `whisper` trigger tiny retro-style animations directly in the poem.

## Features

- Retro 1980s classroom-computer inspired title screen and writing interface
- Brief retro boot-up transition into the notebook
- Large poem editor with `Play My Poem`, `Clear`, `Try an Example`, and `Surprise Me`
- Big modal poem theater for line-by-line playback
- 20 built-in magic words with gentle inline animations
- Reactive stage atmosphere, combo reactions, helper prompts, and typing previews
- Sticker-style rewards, a magic meter, and optional retro blip sounds
- 8 starter poems and rotating writing prompts
- Two visual themes: `Computer Lab` and `Rainbow Terminal`
- Reduced-motion support for accessibility
- Pure front-end app with no backend, login, or external services

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build for production

```bash
npm run build
```

The production files will be generated in `dist/`.

## Project structure

```text
src/
  components/     UI pieces for title, editor, prompts, word effects, and stage
  data/           starter poems, prompts, and magic-word definitions
  hooks/          reduced-motion preference hook
  utils/          poem parsing and reward-message helpers
```

## Notes

- Magic word matching is case-insensitive.
- Punctuation is preserved for display and does not stop matching.
- The animation system is mostly CSS-driven to keep the app lightweight and easy to maintain.
