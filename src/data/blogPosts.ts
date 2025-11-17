export type BlogContentBlock =
  | { type: 'heading'; text: string; level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }
  | { type: 'paragraph'; text: string }
  | { type: 'orderedList'; title?: string; items: string[] }
  | { type: 'unorderedList'; title?: string; items: string[] }
  | { type: 'caption'; text: string }
  | { type: 'image'; src: string; alt?: string; caption?: string };

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  readingTime: string;
  excerpt: string;
  heroImage: string;
  heroImageAlt: string;
  metaTitle?: string;
  metaDescription?: string;
  content?: BlogContentBlock[];
};

const buildHeroImagePath = (fileName: string) => `/blog/${fileName}`;

const removePrototypeLinksContent: BlogContentBlock[] = [
  { type: 'heading', text: 'How to Remove Prototype Links in Figma' },
  {
    type: 'paragraph',
    text: `In the world of design, Figma stands out as a powerful tool for creating stunning interfaces and seamless prototypes. However, as projects evolve, you might find yourself needing to remove prototype links to refine your designs or start afresh. This guide will walk you through the process of removing prototype links in Figma, ensuring that your design workflow remains smooth and efficient.`
  },
  {
    type: 'image',
    src: 'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*0d99XVsmdGud0Xqtb-bGug.png',
    alt: 'Figma design interface',
    caption: 'Figma design interface'
  },
  { type: 'heading', text: 'Understanding Prototype Links in Figma' },
  {
    type: 'paragraph',
    text: `Before diving into the removal process, it's crucial to understand what prototype links are and why they're used. Prototype links in Figma connect different frames or elements, allowing designers to simulate the user experience by navigating through the design. These links are essential for testing interactions and ensuring that the design functions as intended.`
  },
  { type: 'heading', text: 'Why Remove Prototype Links?' },
  {
    type: 'unorderedList',
    items: [
      `Design Overhaul: You're reworking the design and need a clean slate to implement new interactions.`,
      'Error Correction: Incorrect links were added, causing confusion or errors in the prototype.',
      'Streamlining: The design has evolved, and certain links are no longer necessary.'
    ]
  },
  {
    type: 'image',
    src: 'https://cdn.sanity.io/images/599r6htc/regionalized/9cd9e0e6b2c322b439633e76e1b7e6fd6c340824-1920x1080.png?w=804&q=75&fit=max&auto=format&dpr=2',
    alt: 'Design project plan',
    caption: 'Design project plan'
  },
  { type: 'heading', text: 'Manual Removal of Prototype Links' },
  {
    type: 'paragraph',
    text: `One straightforward method to remove prototype links is manually through the Figma interface. Here's how you can do it:`
  },
  {
    type: 'orderedList',
    title: 'Step-by-Step Guide',
    items: [
      `Open the Prototype Tab: Launch Figma and open the project you're working on. Click on the frame containing the prototype links you want to remove. Then, navigate to the "Prototype" tab in the right-hand panel.`,
      'Select the Link: Hover over the element that has a prototype link. You\'ll see a line indicating the connection to another frame. Click on this line to select it.',
      'Delete the Link: Once the link is selected, press the "Delete" key on your keyboard. This action will remove the prototype link from the element.',
      'Repeat as Necessary: Continue this process for each link you want to remove. Check your prototype to ensure all unwanted links have been deleted.'
    ]
  },
  {
    type: 'unorderedList',
    title: 'Pros and Cons of Manual Removal',
    items: [
      'Pros: Provides complete control over which links are removed; no additional tools required.',
      'Cons: Can be time-consuming for projects with numerous prototype links.'
    ]
  },
  { type: 'heading', text: 'Using Figma Plugins to Remove Prototype Links' },
  {
    type: 'paragraph',
    text: 'For those looking to streamline the process, Figma offers various plugins that can help manage and remove prototype links more efficiently. Let\'s explore some popular plugins that can assist in this task.'
  },
  { type: 'heading', text: 'Popular Figma Plugins' },
  {
    type: 'unorderedList',
    items: [
      'Link Manager: This plugin provides a comprehensive overview of all prototype links in your project. You can easily select and remove multiple links at once.',
      'Prototype Cleaner: Designed to clean up your project, this plugin allows you to remove all prototype links in a single click, perfect for starting fresh without manual deletion.',
      'Organize Links: While primarily for organizing, this plugin also offers features to remove unnecessary links, helping maintain a tidy workspace.'
    ]
  },
  {
    type: 'image',
    src: '/blog/remove-prototype-links/figma-plugins-interface.jpg',
    alt: 'Figma plugins interface',
    caption: 'Figma plugins interface (photo by Sigmund — unsplash.com/@sigmund)'
  },
  { type: 'heading', text: 'How to Install and Use Plugins' },
  {
    type: 'orderedList',
    items: [
      'Install the Plugin: Open Figma, click on the "Plugins" tab in the top menu, and select "Browse Plugins in Community." Search for the desired plugin and click "Install."',
      'Activate the Plugin: Once installed, access the plugin through the "Plugins" menu in your project. Select the plugin you wish to use.',
      'Remove Links: Follow the plugin\'s instructions to remove prototype links. Each plugin will have a slightly different interface, but generally, you can select and delete links with ease.'
    ]
  },
  {
    type: 'unorderedList',
    title: 'Pros and Cons of Using Plugins',
    items: [
      'Pros: Saves time, especially for large projects; easy to manage multiple links simultaneously.',
      'Cons: Requires installation; some plugins may have a learning curve.'
    ]
  },
  { type: 'heading', text: 'Best Practices for Managing Prototype Links' },
  {
    type: 'paragraph',
    text: 'To avoid the need for frequent link removal, consider adopting some best practices for managing prototype links in your Figma projects:'
  },
  { type: 'heading', text: 'Plan Your Interactions', level: 'h3' as any },
  {
    type: 'paragraph',
    text: 'Before adding prototype links, plan the user flow and interactions. This foresight reduces the risk of adding unnecessary links and streamlines the design process.'
  },
  { type: 'heading', text: 'Regularly Review Your Prototype', level: 'h3' as any },
  {
    type: 'unorderedList',
    items: [
      'Regularly review your prototype to ensure all links are relevant and functional. This habit helps maintain a clean and efficient design environment.'
    ]
  },
  { type: 'heading', text: 'Use Naming Conventions', level: 'h3' as any },
  {
    type: 'unorderedList',
    items: [
      'Implement consistent naming conventions for frames and elements. Clear labeling makes it easier to track links and identify which ones need removal or adjustment.'
    ]
  },
  { type: 'heading', text: 'Conclusion' },
  {
    type: 'paragraph',
    text: 'Removing prototype links in Figma is a manageable process, whether done manually or with the help of plugins. By understanding your options and implementing best practices, you can keep your design projects organized and efficient. Whether you\'re a seasoned designer or new to Figma, these strategies will help you maintain control over your prototypes and ensure a smooth user experience.'
  },
  {
    type: 'paragraph',
    text: 'Remember, the key to effective design is flexibility and adaptability. As your projects grow and change, your ability to manage prototype links will ensure that your designs remain intuitive and cohesive.'
  },
  {
    type: 'image',
    src: '/blog/remove-prototype-links/creative-design-process.jpg',
    alt: 'Creative design process',
    caption: 'Creative design process (photo by Lucas George Wendt — unsplash.com/@lucasgwendt)'
  },
  {
    type: 'paragraph',
    text: 'By mastering the art of prototype link management in Figma, you can elevate your design projects and deliver exceptional user experiences. Happy designing!'
  }
];

const designSystemGuidelinesContent: BlogContentBlock[] = [
  { type: 'heading', text: 'Best Practices for Effective Design System Guidelines' },
  { type: 'caption', text: 'Design system illustration' },
  {
    type: 'paragraph',
    text: 'Design system guidelines are a set of standards and principles that govern the design and development of products. These guidelines are crucial for ensuring that everyone involved in the project is on the same page, working towards a unified vision. They include everything from color palettes and typography to components and interaction patterns.'
  },
  { type: 'heading', text: 'Components of Design System Guidelines' },
  {
    type: 'paragraph',
    text: 'Design system guidelines encompass various components that work together to form a cohesive whole. These components include visual elements like color schemes and typography, as well as functional components such as buttons, forms, and navigation patterns. Each component plays a specific role in ensuring consistency across different platforms and devices.'
  },
  { type: 'heading', text: 'Role of Design System Guidelines in Brand Identity' },
  {
    type: 'paragraph',
    text: 'Design system guidelines play a pivotal role in maintaining and reinforcing brand identity. They ensure that every digital touchpoint reflects the core values and aesthetics of the brand, creating a unified and recognizable presence. A strong brand identity built on consistent design elements enhances user trust and loyalty.'
  },
  { type: 'heading', text: 'Challenges in Creating Design System Guidelines' },
  {
    type: 'paragraph',
    text: 'Creating design system guidelines involves overcoming several challenges. One common challenge is balancing flexibility with consistency, ensuring that the guidelines are adaptable to different contexts while maintaining a unified look and feel. Additionally, keeping the guidelines up-to-date with evolving design trends and technological advancements is crucial for their continued relevance.'
  },
  { type: 'heading', text: 'Why Are Design System Guidelines Important?' },
  {
    type: 'paragraph',
    text: 'Design system guidelines offer numerous benefits. They enhance productivity by providing designers and developers with a clear roadmap, reducing the need for repeated decision-making. Moreover, they ensure brand consistency, which is vital for building trust and recognition among users. By adhering to these guidelines, teams can create a seamless user experience across various platforms and devices.'
  },
  { type: 'heading', text: 'Enhancing Team Collaboration' },
  {
    type: 'paragraph',
    text: 'Design system guidelines foster a collaborative environment by providing a shared language for designers and developers. When everyone is aligned with the same standards and principles, it becomes easier to communicate ideas and feedback, leading to more efficient collaboration and quicker problem-solving.'
  },
  { type: 'heading', text: 'Streamlining Design and Development Processes' },
  {
    type: 'paragraph',
    text: 'By offering a predefined set of components and patterns, design system guidelines streamline both design and development processes. This reduces redundancy and accelerates the creation of new products and features, allowing teams to focus on innovation and user experience.'
  },
  { type: 'heading', text: 'Ensuring Long-Term Scalability' },
  {
    type: 'paragraph',
    text: 'A robust design system ensures scalability by providing a framework that can evolve with the brand. As organizations grow and their needs change, the design system can be expanded to accommodate new requirements without sacrificing consistency or quality.'
  },
  { type: 'heading', text: 'The Process for Creating a Design System' },
  {
    type: 'paragraph',
    text: "Building a design system involves several critical steps. Here's a straightforward process to guide you through the creation and implementation of an effective design system."
  },
  { type: 'heading', text: '1. Conduct a Thorough Audit' },
  { type: 'caption', text: 'turned on monitoring screen' },
  {
    type: 'paragraph',
    text: "Before diving into the creation of a design system, start with a comprehensive audit of your existing design assets. Review all current design elements, components, and patterns in use. This audit will help you identify inconsistencies and areas for improvement. It's also an excellent opportunity to gather feedback from designers and developers on what works and what doesn't."
  },
  { type: 'heading', text: 'Evaluating Existing Assets' },
  {
    type: 'paragraph',
    text: 'During the audit, evaluate the current design assets for consistency and effectiveness. Identify components that are frequently used and those that are redundant or outdated. Understanding the current state of your design elements is crucial for making informed decisions about what to include in the new system.'
  },
  { type: 'heading', text: 'Gathering Team Insights' },
  {
    type: 'paragraph',
    text: 'Engage with your design and development teams to gather insights on existing workflows and challenges. This collaborative approach ensures that the design system addresses the real-world needs of its users and incorporates valuable feedback from those who will use it most.'
  },
  { type: 'heading', text: 'Identifying Gaps and Opportunities' },
  {
    type: 'paragraph',
    text: 'The audit process also involves identifying gaps and opportunities for improvement. Look for areas where the current design system falls short and explore new design trends and technologies that can enhance the system\'s effectiveness and user experience.'
  },
  { type: 'heading', text: '2. Define Core Principles' },
  { type: 'caption', text: 'Design principles brainstorming' },
  {
    type: 'paragraph',
    text: 'Core principles serve as the foundation of your design system. They reflect the values and goals of your brand and guide the decision-making process. When defining these principles, consider aspects such as accessibility, scalability, and user-centricity. These principles will serve as a north star for your design and development teams.'
  },
  { type: 'heading', text: 'Establishing Brand Values' },
  {
    type: 'paragraph',
    text: "Begin by establishing the core values that define your brand's identity. These values will inform the design principles and ensure that every component of the design system aligns with the overall brand vision and mission."
  },
  { type: 'heading', text: 'Balancing Flexibility and Consistency' },
  {
    type: 'paragraph',
    text: 'When defining core principles, strike a balance between flexibility and consistency. Ensure that the guidelines allow for creative freedom while maintaining a cohesive look and feel across all products and platforms. This balance is essential for encouraging innovation without compromising brand integrity.'
  },
  { type: 'heading', text: 'Integrating User-Centric Design' },
  {
    type: 'paragraph',
    text: 'Incorporate user-centric design principles into your core guidelines. Prioritize user needs and experiences in every design decision, ensuring that the system enhances usability and accessibility for all users, regardless of their abilities or preferences.'
  },
  { type: 'heading', text: '3. Create a Component Library' },
  { type: 'caption', text: 'a close up of a computer monitor and a laptop' },
  {
    type: 'paragraph',
    text: 'A component library is a collection of reusable design elements and patterns. It includes everything from buttons and icons to navigation bars and forms. By standardizing these components, you ensure consistency across all products and platforms. Moreover, a well-organized component library can significantly speed up the design and development process.'
  },
  { type: 'heading', text: 'Standardizing Design Elements' },
  {
    type: 'paragraph',
    text: 'Standardize design elements by creating a unified set of components that can be reused across different projects. This standardization reduces redundancy and ensures that every product reflects the same high-quality design standards.'
  },
  { type: 'heading', text: 'Organizing the Library for Accessibility' },
  {
    type: 'paragraph',
    text: 'Organize the component library in a way that makes it easily accessible and navigable for designers and developers. Use clear categories and labels, and provide detailed documentation for each component to facilitate quick reference and usage.'
  },
  { type: 'heading', text: 'Encouraging Reusability and Adaptability' },
  {
    type: 'paragraph',
    text: 'Design the component library with reusability and adaptability in mind. Ensure that components are flexible enough to be adapted for different contexts without losing their core functionality or aesthetic appeal. This adaptability enhances the efficiency of the design and development processes.'
  },
  { type: 'heading', text: '4. Develop Detailed Documentation' },
  { type: 'caption', text: 'a screen with a bunch of information on it' },
  {
    type: 'paragraph',
    text: 'Comprehensive documentation is crucial for the successful implementation of a design system. It should include guidelines for using design elements, coding standards, and best practices for collaboration. Documentation acts as a reference point for designers and developers, ensuring that everyone is aligned with the design system\'s objectives.'
  },
  { type: 'heading', text: 'Creating User-Friendly Documentation' },
  {
    type: 'paragraph',
    text: 'Develop documentation that is user-friendly and easy to navigate. Use clear language, visuals, and examples to explain complex concepts, making it accessible for team members of all levels of expertise.'
  },
  { type: 'heading', text: 'Including Coding Standards' },
  {
    type: 'paragraph',
    text: 'Incorporate coding standards into the documentation to ensure consistency in development practices. Provide detailed guidelines on how to implement design components in code, ensuring that developers can easily integrate them into projects.'
  },
  { type: 'heading', text: 'Facilitating Ongoing Updates' },
  {
    type: 'paragraph',
    text: 'Design the documentation to accommodate ongoing updates and changes. Establish a process for regularly reviewing and updating the guidelines to reflect new design trends, technologies, and feedback from users.'
  },
  { type: 'heading', text: 'Best Practices for Design System Implementation' },
  {
    type: 'paragraph',
    text: 'Implementing a design system requires collaboration across teams, establishing clear communication channels, and encouraging continuous improvement. It\'s essential to prioritize accessibility to ensure inclusivity for all users. Adapting to feedback and evolving the design system over time ensures its long-term relevance and effectiveness.'
  },
  { type: 'heading', text: 'Foster Collaboration and Communication' },
  {
    type: 'paragraph',
    text: "A design system is most successful when it's a collaborative effort. Encourage open communication between designers, developers, and stakeholders. Regular meetings and workshops can facilitate knowledge sharing and ensure that everyone is aware of updates and changes to the system."
  },
  { type: 'heading', text: 'Building Cross-Functional Teams' },
  {
    type: 'paragraph',
    text: 'Create cross-functional teams that include members from design, development, and product management. This collaboration ensures that diverse perspectives are considered, leading to a more comprehensive and effective design system.'
  },
  { type: 'heading', text: 'Establishing Clear Communication Channels' },
  {
    type: 'paragraph',
    text: 'Establish clear communication channels to facilitate ongoing dialogue between team members. Use tools and platforms that support real-time collaboration, allowing for quick feedback and resolution of issues.'
  },
  { type: 'heading', text: 'Encouraging Feedback and Iteration' },
  {
    type: 'paragraph',
    text: 'Encourage team members to provide feedback on the design system and suggest improvements. Use this feedback to iterate on the system, ensuring that it continues to meet the evolving needs of the organization and its users.'
  },
  { type: 'heading', text: 'Start Small and Iterate' },
  {
    type: 'paragraph',
    text: "When building a design system, it's essential to start small and iterate. Begin by focusing on a few core components and gradually expand the system as needed. This approach allows for flexibility and adaptability, enabling you to refine the system based on user feedback and evolving requirements."
  },
  { type: 'heading', text: 'Focusing on Core Components' },
  {
    type: 'paragraph',
    text: "Identify and prioritize the core components that are most critical to your design system's success. By focusing on these foundational elements, you can build a strong base that can be expanded over time."
  },
  { type: 'heading', text: 'Testing and Refining the System' },
  {
    type: 'paragraph',
    text: 'Test the initial version of the design system with real users and gather feedback on its effectiveness. Use this feedback to refine and improve the system, ensuring that it meets the needs of both internal teams and end-users.'
  },
  { type: 'heading', text: 'Scaling the System Gradually' },
  {
    type: 'paragraph',
    text: 'Gradually expand the design system by adding new components and features as needed. This incremental approach allows for flexibility and adaptability, ensuring that the system can grow and evolve with the organization.'
  },
  { type: 'heading', text: 'Prioritize Accessibility' },
  {
    type: 'paragraph',
    text: 'Accessibility should be a top priority in your design system. Ensure that all components are designed with accessibility in mind, adhering to best practices and guidelines such as WCAG (Web Content Accessibility Guidelines). This not only enhances the user experience for individuals with disabilities but also broadens your audience reach.'
  },
  { type: 'heading', text: 'Designing for Inclusivity' },
  {
    type: 'paragraph',
    text: 'Design components that are inclusive and accessible to all users, regardless of their abilities. Consider factors such as color contrast, text size, and keyboard navigation to ensure that the system is usable by everyone.'
  },
  { type: 'heading', text: 'Adhering to Accessibility Standards' },
  {
    type: 'paragraph',
    text: 'Follow established accessibility standards and guidelines, such as WCAG, to ensure that the design system meets the needs of users with disabilities. Regularly review and update the system to reflect changes in accessibility best practices.'
  },
  { type: 'heading', text: 'Educating Team Members on Accessibility' },
  {
    type: 'paragraph',
    text: 'Provide training and resources to educate team members on the importance of accessibility and how to implement it in their work. Encourage a culture of inclusivity and empathy, ensuring that accessibility is a core consideration in all design and development processes.'
  },
  { type: 'heading', text: 'Maintain and Evolve the System' },
  {
    type: 'paragraph',
    text: 'A design system is not a one-time project but an ongoing process. Regularly review and update the system to reflect changes in technology, user needs, and design trends. Encourage feedback from users and team members to identify areas for improvement and growth.'
  },
  { type: 'heading', text: 'Establishing a Governance Model' },
  {
    type: 'paragraph',
    text: 'Create a governance model to oversee the maintenance and evolution of the design system. This model should outline roles and responsibilities, decision-making processes, and guidelines for updating the system.'
  },
  { type: 'heading', text: 'Encouraging Continuous Improvement' },
  {
    type: 'paragraph',
    text: 'Foster a culture of continuous improvement by regularly soliciting feedback from users and team members. Use this feedback to identify areas for enhancement and ensure that the design system remains relevant and effective.'
  },
  { type: 'heading', text: 'Adapting to Technological Changes' },
  {
    type: 'paragraph',
    text: 'Stay informed about emerging design trends and technological advancements, and adapt the design system accordingly. This proactive approach ensures that the system remains at the forefront of innovation and continues to meet the needs of its users.'
  },
  { type: 'heading', text: 'Provide Training and Support' },
  {
    type: 'paragraph',
    text: 'To ensure successful adoption of the design system, provide training and support for all team members. This can include workshops, tutorials, and onboarding sessions. By equipping your team with the necessary knowledge and skills, you increase the likelihood of consistent and effective use of the design system.'
  },
  { type: 'heading', text: 'Offering Comprehensive Training Programs' },
  {
    type: 'paragraph',
    text: 'Develop comprehensive training programs that cover all aspects of the design system, from core principles to technical implementation. Ensure that these programs are accessible to team members of all skill levels.'
  },
  { type: 'heading', text: 'Providing Ongoing Support and Resources' },
  {
    type: 'paragraph',
    text: 'Offer ongoing support and resources to help team members navigate the design system. This can include access to documentation, FAQs, and dedicated support channels for answering questions and addressing concerns.'
  },
  { type: 'heading', text: 'Encouraging Peer Learning and Knowledge Sharing' },
  {
    type: 'paragraph',
    text: 'Encourage peer learning and knowledge sharing among team members to foster a collaborative learning environment. Create opportunities for team members to share their experiences and insights, building a strong community around the design system.'
  },
  { type: 'heading', text: 'Real-World Examples of Successful Design Systems' },
  {
    type: 'paragraph',
    text: 'Several companies have successfully implemented design systems to enhance their design processes. Here are a few examples:'
  },
  { type: 'heading', text: "Google's Material Design" },
  { type: 'caption', text: 'Google sign' },
  {
    type: 'paragraph',
    text: "Google's Material Design system provides a comprehensive set of guidelines and components for creating intuitive and visually appealing user interfaces. It emphasizes consistency, accessibility, and responsiveness across all Google products."
  },
  { type: 'heading', text: 'Principles of Material Design' },
  {
    type: 'paragraph',
    text: 'Material Design is guided by core principles such as material metaphor, bold graphics, and motion. These principles ensure that the design system delivers a cohesive and immersive user experience across all platforms.'
  },
  { type: 'heading', text: 'Impact on User Experience' },
  {
    type: 'paragraph',
    text: 'Material Design has significantly enhanced the user experience by providing a unified design language that is intuitive and easy to navigate. Its emphasis on accessibility and responsiveness ensures that all users can enjoy a seamless experience, regardless of their device or abilities.'
  },
  { type: 'heading', text: "Salesforce's Lightning Design System" },
  {
    type: 'paragraph',
    text: "Salesforce's design system offers a robust framework for building enterprise applications. It includes a library of components, design tokens, and guidelines for creating cohesive and scalable user experiences."
  },
  { type: 'heading', text: 'Key Features of the Lightning Design System' },
  {
    type: 'paragraph',
    text: 'The Lightning Design System includes a comprehensive set of components and design tokens that enable developers to create scalable and cohesive enterprise applications. Its focus on modularity and flexibility ensures that the system can adapt to a wide range of business needs.'
  },
  { type: 'heading', text: 'Benefits for Enterprise Applications' },
  {
    type: 'paragraph',
    text: 'The Lightning Design System has transformed the development of enterprise applications by providing a consistent and scalable framework. This has reduced development time and enhanced collaboration between design and development teams, leading to more efficient and effective applications.'
  },
  { type: 'heading', text: 'Conclusion' },
  {
    type: 'paragraph',
    text: 'Developing and implementing effective design system guidelines is crucial for any organization looking to maintain consistency and efficiency in their design processes. By following best practices such as fostering collaboration, prioritizing accessibility, and maintaining the system over time, you can create a design system that supports your brand\'s goals and enhances the user experience. Remember, a design system is an evolving entity that requires ongoing attention and refinement to remain relevant and effective.'
  },
  {
    type: 'paragraph',
    text: 'By understanding the importance of design system guidelines and following a structured process for creation and implementation, you can ensure that your design and development teams are equipped with the tools and resources they need to succeed.'
  }
];

const atlassianDesignSystemContent: BlogContentBlock[] = [
  { type: 'heading', text: 'Enhancing User Experience with Atlassian Design System' },
  {
    type: 'paragraph',
    text: "In today's fast-paced digital world, user experience (UX) is more important than ever. Companies need to create products that not only meet the functional needs of their users but also provide an intuitive and enjoyable experience. That's where the Atlassian Design System comes into play. This robust framework helps designers and developers create cohesive, user-friendly interfaces by adhering to a set of well-defined design principles."
  },
  {
    type: 'paragraph',
    text: 'The Atlassian Design System is a collection of guidelines, resources, and tools developed by Atlassian to maintain consistency across its suite of products, such as Jira, Confluence, and Trello. By providing a unified set of components and patterns, it ensures that all Atlassian products deliver a seamless and intuitive user experience.'
  },
  { type: 'heading', text: 'Key Components of the Atlassian Design System' },
  {
    type: 'paragraph',
    text: 'The Atlassian Design System comprises various elements that work together to create a cohesive experience. Here are some of the key components:'
  },
  {
    type: 'unorderedList',
    items: [
      'Design Tokens: These are the foundational elements, such as color, typography, and spacing, that define the look and feel of the product. Design tokens ensure consistency across different platforms and devices.',
      'Components: Reusable UI elements, such as buttons, forms, and navigation bars, form the building blocks of the design system. They are designed to be flexible and adaptable, allowing developers to create interfaces that work seamlessly across different devices.',
      'Patterns: These are pre-defined solutions to common design challenges, like form validation or error messaging. Patterns help streamline the design process and ensure a consistent user experience.'
    ]
  },
  { type: 'heading', text: 'The Importance of Design Principles in User Experience' },
  {
    type: 'paragraph',
    text: 'Design principles are the foundation of any successful design system. They provide a set of guidelines that help designers make informed decisions and create products that are both functional and visually appealing. In the context of the Atlassian Design System, these principles play a crucial role in enhancing the overall user experience.'
  },
  { type: 'heading', text: 'Consistency' },
  {
    type: 'paragraph',
    text: 'Consistency is key to creating a seamless user experience. By using the same design elements and patterns across different products, users can easily navigate and interact with the interface. The Atlassian Design System ensures consistency by providing a unified set of components and guidelines that developers can follow.'
  },
  { type: 'heading', text: 'Accessibility' },
  {
    type: 'paragraph',
    text: 'A great user experience is one that is accessible to everyone, regardless of their abilities. The Atlassian Design System emphasizes the importance of accessibility by incorporating features like keyboard navigation, screen reader support, and color contrast checks into its components. This ensures that all users can easily interact with the product.'
  },
  { type: 'heading', text: 'Flexibility' },
  {
    type: 'paragraph',
    text: 'While consistency is important, flexibility is also crucial in catering to different user needs and preferences. The Atlassian Design System allows developers to customize components and patterns to suit their specific requirements, ensuring a tailored user experience without sacrificing consistency.'
  },
  { type: 'heading', text: 'How to Implement the Atlassian Design System' },
  {
    type: 'paragraph',
    text: 'Implementing the Atlassian Design System in your projects can greatly enhance user experience. Here are some steps to help you get started:'
  },
  { type: 'heading', text: 'Familiarize Yourself with the Design System' },
  {
    type: 'paragraph',
    text: 'Before diving into the implementation, it\'s essential to understand the core components and principles of the Atlassian Design System. Take the time to explore the documentation and resources available on the Atlassian website.'
  },
  { type: 'heading', text: 'Utilize Pre-Built Components and Patterns' },
  {
    type: 'paragraph',
    text: 'One of the main advantages of the Atlassian Design System is its library of pre-built components and patterns. By leveraging these resources, you can save time and effort while ensuring consistency across your product. Simply choose the components that best fit your needs and customize them as necessary.'
  },
  { type: 'heading', text: 'Collaborate with Your Team' },
  {
    type: 'paragraph',
    text: 'Implementing a design system is a team effort. Work closely with designers, developers, and other stakeholders to ensure everyone is on the same page. Regular communication and collaboration will help address any challenges and ensure a smooth integration of the design system into your project.'
  },
  { type: 'heading', text: 'Real-World Examples of Atlassian Design System in Action' },
  { type: 'caption', text: 'User Interface Design' },
  { type: 'caption', text: 'by Tirza van Dijk (https://unsplash.com/@tirzavandijk)' },
  {
    type: 'paragraph',
    text: 'Several companies have successfully implemented the Atlassian Design System to enhance their user experience. Here are a few examples:'
  },
  { type: 'heading', text: 'Jira' },
  {
    type: 'paragraph',
    text: 'Jira, a popular project management tool, uses the Atlassian Design System to create a consistent and intuitive interface. By adhering to the design principles and utilizing pre-built components, Jira provides users with a seamless experience, making it easy to manage tasks and collaborate with team members.'
  },
  { type: 'heading', text: 'Confluence' },
  {
    type: 'paragraph',
    text: 'Confluence, a team collaboration platform, also benefits from the Atlassian Design System. With its user-friendly interface and consistent design elements, Confluence allows users to easily create, share, and collaborate on documents, enhancing productivity and communication within teams.'
  },
  { type: 'heading', text: 'Trello' },
  {
    type: 'paragraph',
    text: 'Trello, a visual project management tool, leverages the Atlassian Design System to maintain a cohesive user experience across its platform. By incorporating consistent design elements and patterns, Trello ensures that users can easily navigate and interact with the app, making project management a breeze.'
  },
  { type: 'heading', text: 'The Future of User Experience with Atlassian Design System' },
  {
    type: 'paragraph',
    text: 'As the digital landscape continues to evolve, the importance of user experience will only grow. The Atlassian Design System is well-equipped to adapt to these changes, providing designers and developers with the tools they need to create exceptional products.'
  },
  {
    type: 'paragraph',
    text: 'By embracing the principles of consistency, accessibility, and flexibility, the Atlassian Design System will continue to enhance user experiences, ensuring that products are not only functional but also enjoyable to use.'
  },
  { type: 'heading', text: 'Conclusion' },
  {
    type: 'paragraph',
    text: 'The Atlassian Design System is a powerful tool for enhancing user experience. By providing a set of design principles, components, and patterns, it enables designers and developers to create cohesive, user-friendly interfaces that meet the needs of their users.'
  },
  {
    type: 'paragraph',
    text: 'Whether you\'re working on a new project or looking to improve an existing product, implementing the Atlassian Design System can help you achieve a seamless and intuitive user experience. Embrace the power of design principles and take your user experience to the next level.'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'remove-prototype-links-in-figma',
    title: 'How to Remove Prototype Links in Figma',
    category: 'Figma Plugins',
    readingTime: '6 min read',
    excerpt:
      'Figma makes it easy to build polished interfaces and prototypes. As files evolve, you may need to strip prototype links to refresh interactions or start clean while keeping your workflow smooth.',
    heroImage: 'https://i.sstatic.net/LzAOP.png',
    heroImageAlt: 'Figma design interface',
    metaTitle: 'How to Remove Prototype Links in Figma',
    metaDescription:
      'Figma makes it easy to build polished interfaces and prototypes. As files evolve, you may need to strip prototype links to refresh interactions or start clean while keeping your workflow smooth.',
    content: removePrototypeLinksContent
  },
  {
    slug: 'mastering-design-system-guidelines',
    title: 'Best Practices for Effective Design System Guidelines',
    category: 'Design Systems',
    readingTime: '8 min read',
    excerpt:
      'Master design system guidelines to enhance brand consistency, streamline processes, and boost collaboration. Learn best practices for creating and implementing an effective design system.',
    heroImage: buildHeroImagePath('design-systems-card.svg'),
    heroImageAlt: 'Design system guidelines overview showing components and principles',
    metaTitle: 'Mastering Design System Guidelines: Best Practices',
    metaDescription:
      'Master design system guidelines to enhance brand consistency, streamline processes, and boost collaboration. Learn best practices for creating and implementing an effective design system.',
    content: designSystemGuidelinesContent
  },
  {
    slug: 'boost-ux-with-atlassian-design-system',
    title: 'Enhancing User Experience with Atlassian Design System',
    category: 'Design Systems',
    readingTime: '6 min read',
    excerpt:
      "In today's fast-paced digital world, user experience (UX) is more important than ever. Companies need to create products that not only meet the functional needs of their users but also provide an intuitive and enjoyable experience.",
    heroImage: buildHeroImagePath('design-systems-card.svg'),
    heroImageAlt: 'Atlassian Design System concepts displayed across interface components',
    metaTitle: 'Enhancing User Experience with Atlassian Design System',
    metaDescription:
      "In today's fast-paced digital world, user experience (UX) is more important than ever. Companies need to create products that not only meet the functional needs of their users but also provide an intuitive and enjoyable experience.",
    content: atlassianDesignSystemContent
  }
];

export const buildBlogPostHref = (slug: string) => `/blog/${slug}`;

export const findBlogPostBySlug = (slug: string) => BLOG_POSTS.find((post) => post.slug === slug);
