import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-5 bg-card text-foreground rounded-lg shadow-md">
      <h1 className="text-center text-3xl font-semibold mb-5">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground"><strong>Effective Date:</strong> [Insert Date]</p>

      <div className="bg-secondary rounded-lg p-5 border border-border shadow">
        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">1. Introduction</h2>
          <p>
            At [App Name], your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your 
            information when you use our social media platform designed for students at [College Name]. By using our platform, 
            you agree to the practices outlined in this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">2. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul className="list-disc pl-5">
            <li><strong>Personal Information:</strong> This includes your name, email address, profile photo, and other details 
            you provide when creating an account.</li>
            <li><strong>Academic Information:</strong> As this is a college-specific platform, we may collect information like 
            your year of study, major, or student ID.</li>
            <li><strong>Content:</strong> Any posts, comments, messages, or other content you share on the platform.</li>
            <li><strong>Usage Data:</strong> We automatically collect data such as IP address, device type, browser type, and 
            activity on the platform (e.g., pages visited, time spent on each section).</li>
            <li><strong>Cookies:</strong> We use cookies to store preferences and enhance your experience. You can control 
            cookies via your browser settings.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">3. How We Use Your Information</h2>
          <p>The information we collect is used for:</p>
          <ul className="list-disc pl-5">
            <li>Creating and managing your account.</li>
            <li>Allowing you to connect and communicate with other students.</li>
            <li>Improving the platform and user experience.</li>
            <li>Sending you notifications or updates related to the app.</li>
            <li>Offering personalized content and recommendations.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">4. Sharing Your Information</h2>
          <p>We will not sell or rent your personal information. However, we may share your data with:</p>
          <ul className="list-disc pl-5">
            <li><strong>Service Providers:</strong> Trusted third parties who help us run the platform (e.g., hosting providers, 
            analytics tools).</li>
            <li><strong>Other Users:</strong> Certain information, like your name and profile photo, will be visible to other 
            users of the platform.</li>
            <li><strong>Legal Authorities:</strong> If required by law or to protect the rights and safety of our users, we may 
            share data with government authorities.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">5. Data Security</h2>
          <p>We take reasonable measures to protect your personal data. However, no online service is completely secure, so we 
            cannot guarantee absolute security of your information.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">6. Your Rights</h2>
          <p>As a user, you have rights over your personal data, including:</p>
          <ul className="list-disc pl-5">
            <li>Accessing, correcting, or deleting your account information.</li>
            <li>Limiting how your information is used.</li>
            <li>Withdrawing consent for data processing (which may affect your ability to use the platform).</li>
          </ul>
          <p>To exercise these rights, please contact us at [Contact Information].</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">7. Children’s Privacy</h2>
          <p>
            This platform is intended for students of [College Name]. We do not knowingly collect personal information from 
            individuals under the age of 13. If we discover that we have collected such information, we will take steps to 
            delete it.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and you will be 
            notified of significant updates.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">9. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please reach out to us at:<br />
            [App Name]<br />
            [Company/College Address]<br />
            Email: [email address]<br />
            Phone: [phone number]
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
