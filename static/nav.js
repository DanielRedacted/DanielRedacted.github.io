
const navHTML = `

<nav class="pane">
    <div style="position:absolute; top:0; left:0; height:100%; width:100%; z-index:-1; background: linear-gradient(to bottom, black, transparent, transparent);"></div>

    <span id="name" style="">
        <a href="index.html">Daniel</a>
        <a style="margin-left:0.5ch;" onclick="copyToClipboard('████')">
            <span class="redacted hover">Redacted</span>
        </a>
    </span>

    <span style="flex:1; min-width:1em;"></span>

    <span id="menu" class="menu" style="flex:1; position: relative;">
        <a href="me.html">
            <span class="redactable">Me</span>
        </a>
        <a class="main-link visible" link-group="data">
            <span class="redactable">Data</span>
        </a>
        <a class="main-link visible" link-group="health">
            <span class="redactable">Health</span>
        </a>
        <a class="main-link visible" link-group="autonomy">
            <span class="redactable">Autonomy</span>
        </a>
        <a href="https://AP0110.com" class="mono" >
            <span class="redactable">AP0110</span>
        </a>
        <div id="relatedLinks" class="pane subLinks" style="position:absolute; top:calc(100%); left:0; width:100%; height:auto; padding:8px 1em 0 1em; display:none; gap:0.5em; border-top: 1px solid gray;"></div>
    </span>

    <span style="flex:2;"></span>

    <a id="link" style="margin:auto 0;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    </a>

    <div id="socialLinks" class="pane subLinks" style="display:none; position:absolute; top:100%; right:0; flex-direction:column; width:fit-content; padding:0 1em 1em 1em;">
        <p style="margin-left: 0.5em;">@DanielRedacted</p>
        <div class="socials">

            <a title="X" href="https://x.com/DanielRedacted" target="_blank">
                <svg id="X" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227" fill="var(--color)">
                    <g clip-path="url(#clip0_1_2)">
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="var(--color)"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_1_2">
                            <rect width="1200" height="1227" fill="var(--color)"/>
                        </clipPath>
                    </defs>
                </svg>
            </a>

            <a title="Substack" href="https://DanielRedacted.substack.com" target="_blank">
                <svg id="Substack" viewBox="0 0 48 48" fill="#ff6719" xmlns="http://www.w3.org/2000/svg" style="stroke-linecap:round;stroke-linejoin:round;">
                    <path class="shaddow" d="m40.0248,10.0817v-4.5814c-.3229,0-.7411-.0004-1.6553-.0004l-28.9669.0004c-.9142,0-1.318,0-1.6553,0v4.5814c.2164,0,.7411.0005,1.6553.0005l28.9669-.0005c.9142,0,1.4122,0,1.6553,0Z"/>
                    <path class="shaddow" d="m40.0248,18.3503v-4.5814H9.4025c-.9142,0-1.3777,0-1.6553,0v4.5814c.2646,0,.7411,0,1.6553,0h30.6223Z"/>
                    <path class="shaddow" d="m40.2557,42.4999v-20.1821c0-.1633-.9724-.1077-1.8866-.1077H9.4022c-.9142,0-1.6553-.0555-1.6553.1077v19.8878c.2814-.1622,15.3415-8.2118,16.1691-8.5978.5156.2972,13.6461,7.3385,16.3406,8.8914l-.0008.0007Z"/>
                </svg>
            </a>
            
            <!-- <a title="LinkedIn" href="https://www.linkedin.com/in/DanielRedacted" target="_blank">
                <svg id="LinkedIn" fill="#0A66C2" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:serif="http://www.serif.com/" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <path class="shaddow" d="M449.446,0c34.525,0 62.554,28.03 62.554,62.554l0,386.892c0,34.524 -28.03,62.554 -62.554,62.554l-386.892,0c-34.524,0 -62.554,-28.03 -62.554,-62.554l0,-386.892c0,-34.524 28.029,-62.554 62.554,-62.554l386.892,0Zm-288.985,423.278l0,-225.717l-75.04,0l0,225.717l75.04,0Zm270.539,0l0,-129.439c0,-69.333 -37.018,-101.586 -86.381,-101.586c-39.804,0 -57.634,21.891 -67.617,37.266l0,-31.958l-75.021,0c0.995,21.181 0,225.717 0,225.717l75.02,0l0,-126.056c0,-6.748 0.486,-13.492 2.474,-18.315c5.414,-13.475 17.767,-27.434 38.494,-27.434c27.135,0 38.007,20.707 38.007,51.037l0,120.768l75.024,0Zm-307.552,-334.556c-25.674,0 -42.448,16.879 -42.448,39.002c0,21.658 16.264,39.002 41.455,39.002l0.484,0c26.165,0 42.452,-17.344 42.452,-39.002c-0.485,-22.092 -16.241,-38.954 -41.943,-39.002Z"/>
                </svg>
            </a> -->
                
            <a title="GitHub" href="https://github.com/DanielRedacted" target="_blank">
                <svg id="GitHub" fill="#6E40C9" enable-background="new 0 0 32 32" version="1.0" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <path class="shaddow" clip-rule="evenodd" d="M16.003,0C7.17,0,0.008,7.162,0.008,15.997  c0,7.067,4.582,13.063,10.94,15.179c0.8,0.146,1.052-0.328,1.052-0.752c0-0.38,0.008-1.442,0-2.777  c-4.449,0.967-5.371-2.107-5.371-2.107c-0.727-1.848-1.775-2.34-1.775-2.34c-1.452-0.992,0.109-0.973,0.109-0.973  c1.605,0.113,2.451,1.649,2.451,1.649c1.427,2.443,3.743,1.737,4.654,1.329c0.146-1.034,0.56-1.739,1.017-2.139  c-3.552-0.404-7.286-1.776-7.286-7.906c0-1.747,0.623-3.174,1.646-4.292C7.28,10.464,6.73,8.837,7.602,6.634  c0,0,1.343-0.43,4.398,1.641c1.276-0.355,2.645-0.532,4.005-0.538c1.359,0.006,2.727,0.183,4.005,0.538  c3.055-2.07,4.396-1.641,4.396-1.641c0.872,2.203,0.323,3.83,0.159,4.234c1.023,1.118,1.644,2.545,1.644,4.292  c0,6.146-3.74,7.498-7.304,7.893C19.479,23.548,20,24.508,20,26c0,2,0,3.902,0,4.428c0,0.428,0.258,0.901,1.07,0.746  C27.422,29.055,32,23.062,32,15.997C32,7.162,24.838,0,16.003,0z" fill-rule="evenodd"/>
                </svg>
            </a>
                
            <!-- <a title="Reddit" href="https://www.reddit.com/u/DanielRedacted" target="_blank">
                <svg id="Reddit" style="fill:#FF4500; fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:serif="http://www.serif.com/" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <path class="shaddow" d="M256,0c141.29,0 256,114.71 256,256c0,141.29 -114.71,256 -256,256c-141.29,0 -256,-114.71 -256,-256c0,-141.29 114.71,-256 256,-256Zm170.667,256c0,-20.66 -16.768,-37.427 -37.427,-37.427c-10.18,0 -19.163,3.892 -25.75,10.48c-25.45,-18.265 -60.781,-30.241 -99.705,-31.738l17.066,-79.944l55.392,11.677c0.599,14.072 12.276,25.45 26.648,25.45c14.672,0 26.648,-11.976 26.648,-26.648c0,-14.671 -11.976,-26.648 -26.648,-26.648c-10.479,0 -19.462,5.989 -23.654,14.971l-61.979,-13.174c-1.796,-0.3 -3.593,0 -5.09,0.898c-1.497,0.898 -2.395,2.395 -2.994,4.192l-18.863,89.226c-39.822,1.197 -75.453,12.874 -101.202,31.738c-6.587,-6.288 -15.869,-10.48 -25.75,-10.48c-20.66,0 -37.427,16.767 -37.427,37.427c0,15.27 8.983,28.145 22.157,34.133c-0.599,3.593 -0.898,7.486 -0.898,11.378c0,57.488 66.769,103.897 149.408,103.897c82.638,0 149.408,-46.409 149.408,-103.897c0,-3.892 -0.299,-7.485 -0.898,-11.078c12.276,-5.989 21.558,-19.163 21.558,-34.433Zm-107.191,97.011c-18.264,18.264 -52.996,19.462 -63.177,19.462c-10.18,0 -45.211,-1.498 -63.176,-19.462c-2.695,-2.695 -2.695,-7.186 0,-9.881c2.695,-2.695 7.186,-2.695 9.881,0c11.377,11.378 35.929,15.569 53.595,15.569c17.665,0 41.918,-4.191 53.595,-15.569c2.695,-2.695 7.186,-2.695 9.881,0c2.096,2.994 2.096,7.186 -0.599,9.881Zm-148.809,-70.363c0,-14.671 11.976,-26.648 26.648,-26.648c14.671,0 26.648,11.977 26.648,26.648c0,14.671 -11.977,26.648 -26.648,26.648c-14.672,0 -26.648,-11.977 -26.648,-26.648Zm144.018,26.648c-14.671,0 -26.648,-11.977 -26.648,-26.648c0,-14.671 11.977,-26.648 26.648,-26.648c14.672,0 26.648,11.977 26.648,26.648c0,14.671 -11.976,26.648 -26.648,26.648Z"/>
                </svg>
            </a>
                
            <a title="YouTube" href="https://www.youtube.com/@DanielRedacted" target="_blank">
                <svg id="YouTube" fill="red" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" xml:space="preserve" viewBox="0 0 234.66667 165.33333" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g inkscape:groupmode="layer" inkscape:label="ink_ext_XXXXXX" transform="matrix(1.3333333,0,0,-1.3333333,0,165.33333)">
                    <g transform="scale(0.1)">
                    <path class="shaddow" d="m 700,358.313 v 523.375 l 460,-261.7 z m 1023.22,688.057 c -20.24,76.22 -79.88,136.24 -155.6,156.61 C 1430.37,1240 880,1240 880,1240 c 0,0 -550.367,0 -687.621,-37.02 C 116.656,1182.61 57.0156,1122.59 36.7773,1046.37 0,908.227 0,620 0,620 0,620 0,331.777 36.7773,193.629 57.0156,117.41 116.656,57.3906 192.379,37.0117 329.633,0 880,0 880,0 c 0,0 550.37,0 687.62,37.0117 75.72,20.3789 135.36,80.3983 155.6,156.6173 C 1760,331.777 1760,620 1760,620 c 0,0 0,288.227 -36.78,426.37" style="fill-opacity:1;fill-rule:nonzero;stroke:none"/>
                    </g>
                    </g>
                </svg>
            </a>

            <a title="Vimeo" href="https://vimeo.com/DanielRedacted" target="_blank">
                <svg id="Vimeo" style="overflow:hidden" fill="#1AB7EA" version="1.1" viewBox="20 20 90 90" x="0px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" y="0px">
                    <g>
                    <path class="shaddow" d="M101,39.9c-0.4,8.4-6.3,20-17.7,34.7c-11.8,15.3-21.8,23-29.9,23c-5.1,0-9.3-4.7-12.8-14c-2.3-8.6-4.7-17.1-7-25.7c-2.6-9.3-5.4-14-8.4-14c-0.6,0-2.9,1.4-6.8,4.1l-4.1-5.3c4.3-3.8,8.5-7.5,12.7-11.3c5.7-4.9,10-7.5,12.9-7.8c6.7-0.6,10.9,4,12.5,13.8c1.7,10.7,2.9,17.3,3.5,19.9c1.9,8.8,4.1,13.3,6.4,13.3c1.8,0,4.5-2.9,8.2-8.6c3.6-5.7,5.6-10.1,5.8-13.1c0.5-4.9-1.4-7.4-5.8-7.4c-2.1,0-4.2,0.5-6.4,1.4c4.3-14,12.4-20.7,24.4-20.3C97.3,22.8,101.5,28.6,101,39.9z"></path>
                    </g>
                </svg>
            </a>
                
            <a title="Rumble" href="https://rumble.com/c/c-6649749" target="_blank">
                <svg id="Rumble" version="1.2" fill="#85c742" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1441 1583">
                    <path class="shaddow" id="Layer" fill-rule="evenodd" d="m1339.3 537.2c32.1 35.2 57.5 75.9 74.8 120.3 17.2 44.4 26.1 91.5 26.2 139.2 0.1 47.6-8.6 94.8-25.7 139.2-17.1 44.4-42.3 85.3-74.3 120.6-57.2 63.1-119 121.9-184.9 175.9-65.9 54-135.7 103-208.9 146.7-73.1 43.6-149.4 81.8-228.2 114.2-78.8 32.4-159.9 59-242.6 79.4-42.2 10.6-86.1 12.9-129.1 6.8-43.1-6.1-84.6-20.4-122.2-42.3-37.7-21.8-70.7-50.7-97.4-85-26.6-34.4-46.4-73.6-58.2-115.4-100.4-343-85.6-730.8 11.2-1075.3 51-180.9 221.3-294.5 396.7-252.7 324.8 77.4 629.6 276.7 862.6 528.4zm-457.3 356.2c61.2-48.4 61.2-142.7 0-192.6q-32.6-27.1-66.8-52.1-34.2-25.1-69.9-48-35.6-22.9-72.6-43.7-37-20.7-75.2-39.2c-70.3-33.6-148.8 13.3-160.1 93.3-17.3 122.3-20.4 245.6-9.1 362.8 7.6 81.1 85.1 129.5 156.5 98.4q39.9-17.2 78.6-37 38.7-19.8 76-42.2 37.3-22.4 73-47.2 35.7-24.8 69.6-52z"/>
                </svg>
            </a>
                
            <a title="TruthSocial" href="https://truthsocial.com/@DanielRedacted" target="_blank">
                <svg id="TruthSocial" viewBox="0 0 144 144" fill="#5448EE" xmlns="http://www.w3.org/2000/svg">
                    <path class="shaddow" d="M140.401 45V13.5H53.1006V129.9H90.6006V45H140.401Z" fill="#5448EE"/>
                    <path class="shaddow" d="M3 13.5H39V45H3V13.5Z" fill="#5448EE"/>
                    <path class="shaddow" d="M104.399 98.3994H140.399V129.899H104.399V98.3994Z" fill="#5448EE"/>
                </svg>
            </a> -->
        </div>
    </div>
</nav>
    `;

document.body.insertAdjacentHTML('afterbegin', navHTML);

const subLinks = document.querySelectorAll(".subLinks");
const socialLinks = document.getElementById("socialLinks");
const relatedLinksContainer = document.getElementById("relatedLinks");

const relatedLinksData = {
    data: [
        { text: "Personal Data", url: "" },
        { text: "Protection Tools", url: "" }
    ],
    health: [
        { text: "Self-monitoring", url: "" },
        { text: "Mil-spec fitness", url: "" }
    ],
    autonomy: [
        { text: "Digital Defense", url: "" },
        { text: "Personal Enhancement", url: "" }
    ],
};

const links = document.querySelectorAll(".main-link")
links.forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent default navigation
        links.forEach(link => {
            link.classList.remove("active");
        })
        link.classList.add("active");

        const group = this.getAttribute("link-group");
        subLinks.forEach(element => {
            element.style.display = "none";
        });
        relatedLinksContainer.innerHTML = ""; // Clear old links

        // Populate with new links
        relatedLinksData[group].forEach(linkInfo => {
            const newLink = document.createElement("a");
            newLink.href = linkInfo.url;
            newLink.target = "_blank";

            const span = document.createElement("span");
            span.classList.add('redactable')
            span.textContent = linkInfo.text;
            newLink.appendChild(span);

            relatedLinksContainer.appendChild(newLink);
        });

        // Show the div
        relatedLinksContainer.style.display = "flex";
    });
});

document.getElementById("link").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default navigation

    links.forEach(link => {
        link.classList.remove("active");
    })

    subLinks.forEach(element => {
        element.style.display = "none";
    });

    // Show the div
    socialLinks.style.display = "flex";
});

// Hide the divs when clicking outside
document.addEventListener("click", function(event) {
    if (!event.target.closest(".main-link") && !event.target.closest("#link")) {
        links.forEach(link => {
            link.classList.remove("active");
        })
        relatedLinksContainer.style.display = "none";
        socialLinks.style.display = "none";
    }
});