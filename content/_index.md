---
date: 2024-07-23
params:
      showHeadingAnchors: false
---
<div class="bg"></div>
<div class="bg bg2"></div>
<div class="bg bg3"></div>
<div class="animation"></div>

{{< typeit class="dynamic-text-container" literal="true" speed=30 >}}
      .pause(500)
      .type("<strong>How can I help?</strong>")
      .break()
      .break()
      .pause(500)
      .type("I <strong class='i'>bootstrap</strong> support for startups gaining traction")
      .pause(1500)
      .delete(".i")
      .type("<strong class='i'>hire</strong> and train top performing teams")
      .pause(1500)
      .delete(".i")
      .type("<strong class='i'>find</strong> the right place for AI in support")
      .pause(1500)
      .delete(".i")
      .type("<strong class='i'>build</strong> teams that keep customers, developers, and sales happy")
      .pause(1500)
      .delete(".i")
      .type("<strong class='i'>create</strong> processes that help companies retain customers")
      .pause(1500)
      .delete()
      .break()
      .break()
      .type("I help <strong>startups</strong> become <strong>global enterprises.</strong>")
      .go();
{{< /typeit >}}

<br />

<div class="flex justify-center text-center gap-8 pb-8 leading-none">
  <div>
    {{< button href="about" >}}
      Learn More
    {{< /button >}}
  </div>
  <div>
    {{< button href="https://zeeg.me/timobrien" color="red">}}
      Schedule a Call
    {{< /button >}}
  </div>
</div>

<br />

<div class="columns">
  <div class="column bg-primary-500 inverse">
    <h2 class="table-header"><b>Foundations</b> for Early Stage Startups</h2>
    <div class="content">
        <p>You have a few customers and are approaching product market fit, but no professional support organization. 
        </p>
        <p>I can help you build a roadmap, hire your initial team, and decide what you will need in place before your growth accelerates.</p>
    </div>
    <div class="column-button-container">
      {{< button href="foundations" >}}Learn more{{< /button >}}
    </div>
  </div>
  <div class="column bg-primary-600">
    <h2 class="table-header"><b>Growth</b> for Mid Stage Startups</h2>
    <div class="content">
      <p>
            You're close to or have hit product-market fit and are ready to rapidly expand.
      </p>
      <p> 
            I can help build your enterprise organization or upskill a team already in place to execute.
      </p>
    </div>
    <div class="column-button-container">
      {{< button href="grow" >}}Learn more{{< /button >}}
    </div>
  </div>
  <div class="column bg-secondary-600">
    <h2 class="table-header"><b>Scale</b> for Growing Enterprises</h2>
    <div class="content">
      <p>You have a significant number of existing customers and a professional support organization. I can help refine and improve your support processes, identifying opportunities for the team to excel.</p>
    </div>
    <div class="column-button-container">
      {{< button href="scale" >}}Learn more{{< /button >}}
    </div>
  </div>
</div>

<div class="split-container">
  <div class="image-container">
    {{< figure 
      src="headshotSmiling.jpg"
      alt="Headshot of Tim O'Brien smiling"
      height="100%"
    >}}
  </div>
  <div class="text-container">
    <h2>Hi! I'm Tim 👋</h2>
    <p>
      I've spent the last 15 years helping startups build world class support organizations from the ground up. I work with <b>Founders</b>, <b>CEOs</b>, <b>CTOs</b> and <b>Heads of Product</b> who need to solve the unique challenges encountered when a startup begins supporting global enterprises.
    </p>
    <p>
      I can help achieve clarity on your support strategy, align your sales, support and engineering organizations, and bootstrap functions that will help you retain customers and operate at peak efficiency while managing the complexities of hypergrowth.
    </p>
    <br />
    {{< button href="about" >}}Learn more{{< /button >}}
  </div>
</div>      