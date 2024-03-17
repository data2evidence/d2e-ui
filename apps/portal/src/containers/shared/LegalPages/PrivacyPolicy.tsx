import React, { FC } from "react";
import { LegalPageProps } from "./Imprint";

const PrivacyPolicy: FC<LegalPageProps> = ({ type }) => {
  return (
    <>
      {type === "public" && <div className="page-header">Privacy Policy</div>}

      <div className="content margin-medium">
        {`With our Data4Life Analytics Platform (following “ALP”), which registered and approved users can access by using the ALP portal, we enable you to securely access and analyze health data digitally for medical research purposes. 

        This information describes how Data4Life processes your personal data. Sections 1 to 3 inform you about the responsible controller and your legal rights and Sections 4 to 7 explain how your personal data is processed when you register for and use the Data4Life Analytics Platform.`}
      </div>

      <div className="content strong">1. Controller and data protection officer</div>
      <div className="content margin-medium">
        {`The controller pursuant to Art. 4 para. 7 of the General Data Protection Regulation (GDPR) for the frontend (ALP portal), the backend, e.g. authorization / authentication, databases, and the infrastructure, e.g. servers, data storage, is

        D4L data4life gGmbH
        c/o Digital Health Cluster (DHC) im Hasso-Plattner-Institut (HPI)
        Rudolf-Breitscheid-Straße 187
        14482 Potsdam


        You can reach our data protection officer at dataprotection@data4life.help or our postal address by writing to the attention of "The data protection officer".`}
      </div>

      <div className="content strong">2. Your rights</div>
      <div className="content margin-medium">
        {`You have the following rights regarding personal data concerning you:
        – Right to access (Art. 15 GDPR),
        – Right to rectification (Art. 16 GDPR),
        – Right to erasure (Art. 17 GDPR; “Right to be forgotten”),
        – Right to limitation of processing (Art. 18 GDPR),
        – Right to object to the processing (Art. 21 GDPR),
        – Right to data transferability (Art. 20 GDPR).

        You also have the right to complain about our processing of your personal data to a data protection supervisory authority in the member state where you are located, at your place of work or at the location of the alleged infringement if you believe that the processing of your personal data is unlawful. The supervisory authority responsible for us is:

        Die Landesbeauftragte für den Datenschutz und für das Recht auf Akteneinsicht
        Stahnsdorfer Damm 77
        14532 Kleinmachnow
        Germany

        Telephone: 0049 (0)33203/356-0
        Telefax: 0049 (0)33203/356-49
        Email: poststelle@lda.brandenburg.de

        If you have given us consent to the processing of your data, you can revoke it at any time with effect for the future. The lawfulness of processing your data until revocation remains unaffected by this.
        You can contact us at  time using the contact channels listed in Section 1 above and/or the contact information listed in our imprint for the assertion of your rights or for other data protection concerns.`}
      </div>

      <div className="content strong">3. Supplementary note about your right of objection</div>
      <div className="content margin-medium">
        {`Please note that if your personal data is processed on the basis of a legitimate interest within the scope of the balancing of interests pursuant to Art. 6 para.1 sentence 1 f) GDPR, you have the right to object to the processing of your personal data at any time. You can indicate your objection by contacting us at any time using the contact channels listed in Section 1 and/or the contact information in our imprint.`}
      </div>

      <div className="content strong">4. Purposes and legal bases of the processing of your personal data</div>

      <div className="content strong">a. Use of ALP portal</div>
      <div className="content margin-medium">
        {`When the ALP portal is used, the following data is automatically transferred to the web server of Data4Life:

        - IP address of the device used for the retrieval
        - Web address (URL) of the page from which the file was requested (referrer)
        - Date and time of the request
        - Amount of data transmitted
        - Description of the type of web browser used

        The processing of this data, which contains a (pseudonymized) personal reference via the IP address, is technically necessary and is carried out in order to provide you with the Data4Life offering. The legal basis for the aforementioned processing is Art. 6 para. 1 sentence 1 lit. b GDPR (processing is necessary for the fulfillment of a contract with the data subject).
        
        To avert threats to the security of Data4Life’s infrastructure and to provide law enforcement authorities with the information necessary for prosecution in the event of a cyberattack, e.g. in a DDoS attack, the data mentioned above is generally stored in log files for a period of seven days. In the event of an attack, log data is retained for the purpose of preserving evidence until the respective incident has been resolved. The legal basis of this processing is Art. 6 para. 1 sentence 1 lit. f GDPR (processing is necessary to safeguard the legitimate interests of the controller). Data4Life’s legitimate interest is to provide sufficient security and stability to our web servers.`}
      </div>

      <div className="content strong">b. Registration for the Data4Life Analytics Platform using the ALP portal</div>
      <div className="content margin-medium">
        {`You can register for the Data4Life Analytics Platform using our ALP portal. In order to register for the Data4Life offering, you are required to provide your email address, a password and your full name. If you have forgotten your password, please follow the reset password procedures on the ALP portal.

        The legal basis for the aforementioned processing is Art. 6 para. 1 sentence 1 lit. b GDPR (processing is necessary for the fulfillment of a contract with the data subject).

        After successful registration, you can access the Data4Life Analytics Platform with your credentials and use the functionalities offered.`}
      </div>

      <div className="content strong">c. Authentication via identity as a service</div>
      <div className="content margin-medium">
        {`If you log in to your user account at the Data4Life Analytics Platform, the following data is collected by Microsoft via the Microsoft Azure Active Directory business-to-customer (Azure AD B2C) as part of the authentication flow:

        - date and time of request
        - e-mail address used
        - kind of activity that was performed, e.g., login or reset password actions

        The processing of this data, which contains a (pseudonymized) personal reference, is technically necessary and is carried out in order to provide you with the Data4Life Analytics Platform. The legal basis for the aforementioned processing is Art. 6 para. 1 sentence 1 lit. b GDPR (processing is necessary for the fulfillment of a contract with the data subject).`}
      </div>

      <div className="content strong">d. Support/Contact</div>
      <div className="content margin-medium">
        {`When you contact us using the contact form provided on our website, for example, email, post, or telephone, the data you provide (for example, your email address and your name as well as the content of your inquiry) will be stored by us in order to process and answer your questions or concerns or to provide the support you require when using the Data4Life offering. The legal basis for this collection of data is Art. 6 para. 1 sentence 1 lit. b GDPR (processing is necessary for the fulfillment of a contract with the data subject) when we are in the process of entering into or already have a contractual relationship. The legal basis is Art. 6 para. 1 sentence 1 lit. f GDPR (processing is necessary to safeguard the legitimate interests of the controller) if we do not have or do not plan a contractual relationship, for example, when the contact is of a general nature. Our legitimate interest in the latter case is to answer your inquiry by providing appropriate and useful information. 
        We anonymize the data arising in this context after the storage is no longer necessary (usually four weeks after we fully answered your request), or restrict the processing if there are legal storage obligations. The legal basis for the processing described above is Art. 6 para. 1 sentence 1 lit. f (processing is necessary to safeguard the legitimate interests of the controller). Data4Life has a legitimate interest in collecting key performance indicators as part of a quality management system for continuous improvement of the services offered. For this purpose, we systematically evaluate the number of contacts and the reasons for them, the processing time of inquiries and other key figures.`}
      </div>

      <div className="content strong">5. Recipients or categories of recipients</div>
      <div className="content margin-medium">
        {`For the purpose of sending you emails for account registration (see section 4 b. above), your email address will be disclosed to Sendinblue, 7 rue de Madrid, 75008 Paris, France who supports us as a data processor. We have concluded data processing agreements with Sendinblue pursuant to Art. 28 para. 3 GDPR.

        For the purpose of registration, logins and access restrictions (see section 4 b. and c. above), all information provided by you during registration and used for logins (email, nickname, email address, password) is disclosed to and stored by Microsoft Ireland Operations, Ltd., One Microsoft Way, South County Business Park, Leopardstown, Dublin, D18 P521, Ireland, who supports us as a data processor. We have concluded a data processor agreement and EU standard contractual clauses with Microsoft Corporation pursuant to Art. 28 para 3. GDPR.

        For the purpose of facilitating email communication for support and other contact Data4Life discloses contact information and content data, for example, email contents, to our email service provider Heinlein Hosting GmbH, Schwedter Straße 9a, 10119 Berlin, Germany. We have concluded a data processing agreement pursuant to Art. 28 para. 3 GDPR with Heinlein Hosting.

        For the purpose of managing contact and support requests we disclose the contact information and email content to our processor Zammad GmbH, Marienstraße 18, 10117 Berlin, Germany. We have concluded a data processing agreement pursuant to Art. 28 para. 3 GDPR with Zammad. 

        In all of the above mentioned cases, D4L data4life gGmbH remains as the data controller.`}
      </div>

      <div className="content strong">6. Log files/Information provided by your browser</div>
      <div className="content margin-medium">
        {`Data4Life utilizes backups to be able to retrieve data in a loss event, e.g. the destruction of our primary data storage location. Please note that Data4Life regularly stores data backups, which also include your personal account data. This data is stored for up to 30 days in encrypted backups. After 30 days the data will be deleted. 

        Please note that when you request the deletion of your personal data or your account Data4Life does not delete your data from backups because the deletion of specific data from a backup requires an inadequate amount of time and resources versus deletion in the active dataset.

        For the purpose of identifying and reacting to cyber attacks, Data4Life also stores audit log data. An audit log is a record of a security relevant event in an IT system. Those logs usually contain information on who has accessed, edited or deleted what data at what time. We store this data for up to 1.5 years. 

        The legal basis for the processing described above is Art. 6 para. 1 sentence 1 lit. f GDPR (processing is necessary to safeguard the legitimate interests of the controller).`}
      </div>

      <div className="content strong">7. Use of cookies</div>
      <div className="content margin-medium">
        {`When you use the Analytics Platform Data4Life uses cookies. Cookies are small blocks of data created by the server and stored on your end device (laptop, tablet, smartphone or similar).
        On the analytics platform we only use strictly  necessary cookies to provide basic functionalities of the ALP portal. In the following, for the sake of uniformity, we refer to cookies when other cookie-like technologies are used, such as the storage of data as a "local storage item" in the browser. The ALP portal uses only functional cookies which mainly carry the authentication related details. Following is the list of cookies generated by Azure AD B2C and stored on the client computer. These cookies are selectively attached to the server request as required.
        - Access token
        - ID token
        - MSAL (Microsoft Authentication Library) token
        - Refresh token
        - MSAL (Microsoft Authentication Library) claim
        The above cookies are used by the authentication flow and essential for the functionality of the application. Those cookies do not collect information about you for marketing purposes or for analysis purposes. The legal basis for the processing of data from technically necessary cookies is Art. 6 para. 1 sentence 1 lit. f GDPR (processing is necessary to protect the legitimate interests of the controller) based on our legitimate interest in a user-friendly authentication process.`}
      </div>

      <div className="content margin-small">Last updated: January 2023</div>
    </>
  );
};

export default PrivacyPolicy;
