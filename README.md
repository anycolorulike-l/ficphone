<p align="center"><a href="https://anycolorulike-l.github.io/ficphone/"><img src="brand/svg/ficphone-horizontal.svg" width="360" alt="FicPhone"></a></p>

# FicPhone · Found-phone story maker and chat screenshot editor

Create interactive found-phone stories, K-pop fanfiction and social media AUs in your browser. Readers can open apps, explore conversations, browse photos and follow clues through a fictional phone. You can also create standalone chat, social media and forum screenshots.

**[Open FicPhone Studio](https://anycolorulike-l.github.io/ficphone/studio.html)** · [Play the demo](https://anycolorulike-l.github.io/ficphone/demo.html) · [中文操作指南](README.zh-CN.md)

Current version: `v1.0.3-beta.1`. Free to use. The editor runs in your browser and requires no account. Desktop browsers give you the most room to edit and preview. Open **User guide** in the editor for illustrated steps in English and Chinese.

| Mode | What you can make |
| --- | --- |
| Screenshots | KakaoTalk, LINE, Messages / iMessage, Instagram, X and theqoo templates. Set different times and content for individual sheets, organize them into groups, and export selected PNGs in a ZIP. |
| Interactive phone | A fictional phone with chats, posts, albums, notes, call history and a calendar. Let readers explore freely, or add up to 99 story steps. Export a standalone HTML file. |

The [FicPhone homepage](https://anycolorulike-l.github.io/ficphone/) links to the studio and the [interactive stories gallery](https://anycolorulike-l.github.io/ficphone/works.html). The editor supports Chinese, English, Korean and Japanese. Phone and hint languages can be set separately.

## What's new in v1.0.3-beta.1

- Adjusted the screenshot sheet limit. Organize sheets into groups, rename and reorder them, and export a group or a selection as a ZIP.
- Add single photos and voice messages directly from the chat editor. Enter a duration for a static voice bubble or upload audio for readers to play. Start a new visual group within consecutive messages when needed.
- Expand interactive content by app, add calls and events on multiple dates, and browse the calendar across months.
- Find canvas and font settings under **Project basics**, and chat names, avatars and group members under **Conversation details**. Section headings take up less space.

## Make a screenshot

1. Select **Screenshots**, then pick a chat or social template.
2. Open **Chat script** or the post settings. Enter one message per line, for example `Sana: [23:08] Hello!`. Use **Add photo message** or **Add voice message** to create a separate message with its own sender and time. In X or theqoo, indent a new comment by two spaces or press Tab to reply to the nearest top-level comment.
3. Open **Project basics → Canvas** to set the device and time, or **Fonts & size** to choose a preset or a size from 7 to 30 pt. Check the preview and export a single PNG, a long image, or multiple pages. For a set, duplicate the sheet, edit each copy, then open **Manage screenshot sheets** to organize or select what to export.

## Make an interactive phone

1. Click **New interactive phone** and choose **Free exploration** or **Story exploration**. Use **Reading mode** to switch within the same project and keep your existing steps. In **Phone appearance → Project basics → Canvas**, choose a device, set the wallpapers, or select **Screen only** for a borderless reader view. Open **Lock screen settings** to choose the starting screen or add a four- or six-digit passcode.
2. Under **Home screen apps**, enable apps, assign them to pages and configure the Dock and widgets. Under **App content**, expand the app you want to edit. Add your photos and notes under **Albums & notes**.
3. In **Story triggers**, connect reader actions to new messages, notes, app unlocks, choices or endings. For a message, select the app and destination conversation. You can set a withdrawal delay, offer a scripted reply or configure the hint language here.
4. Play through the story in the preview, then choose **Export interactive HTML**. Readers can open that file in a browser.

For dated entries, add a date at the start of each line, such as `2026-06-07 · Sana · 22:48 · Missed call` or `2026-06-08 · 09:00 · Dance practice`. In **Calendar events**, you can also set the opening date.

Readers click the play button on a voice bubble that has uploaded audio. A duration-only bubble can be used in screenshots or as a static prop in an interactive story.

## Share an interactive story

- **Self-host** — Upload the exported HTML to a static web host and share the resulting reader URL. The studio URL opens the editor.
- **Publish with an invite** — When the site has enabled publishing, open **Publish to FicPhone** in Interactive phone, enter an invite code and the work details, then copy the reader link. **List in the gallery** adds the work to the public gallery. An unlisted work can still be opened by anyone with its link. The publishing payload limit is 5 MiB.

## Save and continue later

FicPhone autosaves drafts in the current browser. Use **Back up project** to download an editable JSON copy, and **Import project** to reopen it. PNG and HTML are finished works. If you want to reuse your current phone setup, **New blank story with these settings** saves the original to your project library before creating the blank work.

Click the version number in the editor footer to see what changed. Use **User guide** for the current steps in English or Chinese. The walkthrough below was recorded in an earlier beta, so the toolbar and panel layout may differ.

![FicPhone editor and phone preview](docs/guide-assets/screenshots.png)

[Feature overview video](docs/guide-assets/FicPhone-overview-en.mp4) · [Step-by-step walkthrough](docs/guide-assets/walkthrough-en.mp4) · [查看中文操作指南](README.zh-CN.md)
