import React from 'react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-5 bg-card text-foreground rounded-lg shadow-md">
      <h1 className="text-center text-3xl font-semibold mb-5">Terms and Conditions</h1>
      <p className="text-sm text-muted-foreground"><strong>Effective Date:</strong> [Insert Date]</p>

      <div className="bg-secondary rounded-lg p-5 border border-border shadow">
        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">1. Acceptance of Terms</h2>
          <p>
            By creating an account and using our platform, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">2. User Accounts</h2>
          <p>
            You must create an account to access certain features of the platform. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during the registration process.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">3. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5">
            <li>Use the platform for any unlawful purpose or in violation of any applicable laws or regulations.</li>
            <li>Harass, abuse, or harm other users.</li>
            <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
            <li>Post any content that is offensive, harmful, or inappropriate.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">4. Content Ownership and Rights</h2>
          <p>
            You retain ownership of the content you create and share on the platform. By posting content, you grant [App Name] a non-exclusive, royalty-free, worldwide license to use, display, and distribute your content for the purpose of operating and promoting the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">5. Intellectual Property</h2>
          <p>
            All content, trademarks, and other intellectual property on the platform are the property of [App Name] or its licensors. You may not use, reproduce, or distribute any of our intellectual property without our prior written consent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">6. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account and access to the platform if you violate these Terms and Conditions or engage in any conduct that we deem harmful or inappropriate.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">7. Disclaimer of Warranties</h2>
          <p>
            The platform is provided on an "as-is" and "as-available" basis without warranties of any kind. We do not guarantee that the platform will be error-free, uninterrupted, or free of viruses or other harmful components.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, [App Name] shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of or inability to use the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">9. Changes to Terms</h2>
          <p>
            We may update these Terms and Conditions from time to time. We will notify you of any significant changes, and your continued use of the platform after such changes constitutes your acceptance of the new terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">10. Governing Law</h2>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of [Your State/Country]. Any disputes arising out of or related to these terms shall be resolved in the courts of [Your State/Country].
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl text-primary font-medium border-b-2 border-accent pb-2 mb-3">11. Contact Us</h2>
          <p>
            If you have any questions or concerns about these Terms and Conditions, please contact us at:<br />
            Email: [email address]<br />
            Address: [Company/College Address]
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;

