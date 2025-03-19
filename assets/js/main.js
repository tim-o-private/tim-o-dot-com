    import { ResizeObserver } from '@juggle/resize-observer';

    const ARTICLE_CONTENT_SELECTOR = "div.article-content";
    const FOOTNOTE_SECTION_SELECTOR = "div.footnotes[role=doc-endnotes]";
    // this is a prefix-match on ID.
    const INDIVIDUAL_FOOTNOTE_SELECTOR = "li[id^='fn:']";
    const FLOATING_FOOTNOTE_MIN_WIDTH = 1260;
    // Importing `utils.js` directly.
    function docReady(fn) {
        // see if DOM is already available
        if (document.readyState === "complete" || document.readyState === "interactive") {
            // call on next available tick
            setTimeout(fn, 1);
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function windowLoaded(fn) {
        // see if we're already loaded
        if (document.readyState === "complete") {
            // call on next available tick
            setTimeout(fn, 1);
        } else {
            window.addEventListener("load", fn);
        }
    }

    function onWindowResize(fn) {
        windowLoaded(function () {
            window.addEventListener('resize', fn);
            setTimeout(fn, 1);
        });
    }
    // Import anchorizeHeadings directly
    function anchorForId(id) {
        const anchor = document.createElement("a");
        anchor.className = "header-link";
        anchor.title = "Link to this section";
        anchor.href = "#" + id;
        // Icon from https://useiconic.com/open#icons
        anchor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><path d="M5.88.03c-.18.01-.36.03-.53.09-.27.1-.53.25-.75.47a.5.5 0 1 0 .69.69c.11-.11.24-.17.38-.22.35-.12.78-.07 1.06.22.39.39.39 1.04 0 1.44l-1.5 1.5c-.44.44-.8.48-1.06.47-.26-.01-.41-.13-.41-.13a.5.5 0 1 0-.5.88s.34.22.84.25c.5.03 1.2-.16 1.81-.78l1.5-1.5c.78-.78.78-2.04 0-2.81-.28-.28-.61-.45-.97-.53-.18-.04-.38-.04-.56-.03zm-2 2.31c-.5-.02-1.19.15-1.78.75l-1.5 1.5c-.78.78-.78 2.04 0 2.81.56.56 1.36.72 2.06.47.27-.1.53-.25.75-.47a.5.5 0 1 0-.69-.69c-.11.11-.24.17-.38.22-.35.12-.78.07-1.06-.22-.39-.39-.39-1.04 0-1.44l1.5-1.5c.4-.4.75-.45 1.03-.44.28.01.47.09.47.09a.5.5 0 1 0 .44-.88s-.34-.2-.84-.22z" /></svg>';
        return anchor;
    }

    function anchorizeHeadings() {
        // If we've found more than 1 article, then abort. It probably means I've
        // messed something up if this is the case, but I don't have enough
        // confidence in the way I've set everything up to _not_ do this safety
        // check.
        const articles = document.querySelectorAll('article#main');
        if (articles.length != 1) {
            return;
        }
        // Keep this list of header classes in sync with style.css
        const headers = articles[0].querySelectorAll('h2, h3, h4');
        Array.prototype.forEach.call(headers, function (el, i) {
            var link = anchorForId(el.id);
            el.appendChild(link);
        });
    }

    function anchorizeOnReady() {
        docReady(anchorizeHeadings);
    }
        // Computes an offset such that setting `top` on elemToAlign will put it
        // in vertical alignment with targetAlignment.
        function computeOffsetForAlignment(elemToAlign, targetAlignment) {
            const offsetParentTop = elemToAlign.offsetParent.getBoundingClientRect().top;
            // Distance between the top of the offset parent and the top of the target alignment
            return targetAlignment.getBoundingClientRect().top - offsetParentTop;
        }

        function setFootnoteOffsets(footnotes) {
            // Keep track of the bottom of the last element, because we don't want to
            // overlap footnotes.
            let bottomOfLastElem = 0;
            Array.prototype.forEach.call(footnotes, function (footnote, i) {

                // In theory, don't need to escape this because IDs can't contain
                // quotes, in practice, not sure. ¯\_(ツ)_/¯

                // Get the thing that refers to the footnote
                const intextLink = document.querySelector("a.footnote-ref[href='#" + footnote.id + "']");
                // Find its "content parent"; nearest paragraph or list item or
                // whatever. We use this for alignment because it looks much cleaner.
                // If it doesn't, your paragraphs are too long :P
                // Fallback - use the same height as the link.
                const verticalAlignmentTarget = intextLink.closest('p,li') || intextLink;
                let offset = computeOffsetForAlignment(footnote, verticalAlignmentTarget);
                if (offset < bottomOfLastElem) {
                    offset = bottomOfLastElem;
                }
                // computedStyle values are always in pixels, but have the suffix 'px'.
                // offsetHeight doesn't include margins, but we want it to use them so
                // we retain the style / visual fidelity when all the footnotes are
                // crammed together.
                bottomOfLastElem =
                    offset +
                    footnote.offsetHeight +
                    parseInt(window.getComputedStyle(footnote).marginBottom) +
                    parseInt(window.getComputedStyle(footnote).marginTop);

                footnote.style.top = offset + 'px';
                footnote.style.position = 'absolute';
            });
        }

    function clearFootnoteOffsets(footnotes) {
        // Reset all
        Array.prototype.forEach.call(footnotes, function (fn, i) {
            fn.style.top = null;
            fn.style.position = null;
        });
    }

    // contract: this is idempotent; i.e. it won't wreck anything if you call it
    // with the same value over and over again. Though maybe it'll wreck performance
    // lol.
    function updateFootnoteFloat(shouldFloat) {
        const footnoteSection = document.querySelector(FOOTNOTE_SECTION_SELECTOR);
        const footnotes = footnoteSection.querySelectorAll(INDIVIDUAL_FOOTNOTE_SELECTOR);
        console.log(footnotes);
        if (shouldFloat) {
            // Do this first because we need styles applied before doing other
            // calculations
            footnoteSection.classList.add('floating-footnotes');
            setFootnoteOffsets(footnotes);
            subscribeToUpdates();
        } else {
            unsubscribeFromUpdates();
            clearFootnoteOffsets(footnotes);
            footnoteSection.classList.remove('floating-footnotes');
        }
    }

    function subscribeToUpdates() {
        const article = document.querySelector(ARTICLE_CONTENT_SELECTOR);
        // Watch for dimension changes on the thing that holds all the footnotes so
        // we can reposition as required
        resizeObserver.observe(article);
    }

    function unsubscribeFromUpdates() {
        resizeObserver.disconnect();
    }

    const notifySizeChange = function() {
        // Default state, not expanded.
        let bigEnough = false;

        return function () {
            // Pixel width at which this looks good
            let nowBigEnough = window.innerWidth >= FLOATING_FOOTNOTE_MIN_WIDTH;
            if (nowBigEnough !== bigEnough) {
                updateFootnoteFloat(nowBigEnough);
                bigEnough = nowBigEnough;
            }
        };
    }();

    const resizeObserver = new ResizeObserver((_entries, observer) => {
        // By virtue of the fact that we're subscribed, we know this is true.
        updateFootnoteFloat(true);
    });

    function enableFloatingFootnotes() {
        docReady(() => {
            const footnoteSection = document.querySelector(FOOTNOTE_SECTION_SELECTOR);
            console.log(footnoteSection);
            const article = document.querySelector(ARTICLE_CONTENT_SELECTOR);
            console.log(article);
            const allowFloatingFootnotes = article && !article.classList.contains('no-floating-footnotes');

            // only set it all up if there's actually a footnote section and
            // we haven't explicitly disabled floating footnotes.
            if (footnoteSection && allowFloatingFootnotes) {
                onWindowResize(notifySizeChange);
            }
        });
    }

    enableFloatingFootnotes();
    anchorizeHeadings();

    /*
    docReady(() => {
      // const menu = document.getElementById('right-links-details');
      // if 'menu' is null it will fail noisily
      menu.addEventListener('toggle', (_event) => {
        if (menu.open) {
          document.addEventListener('scroll', (_event) => {
            menu.open = false;
          }, {once: true});
        }
      })
    });*/