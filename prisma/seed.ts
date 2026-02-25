import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...\n");

  // ─── 1. Create Super Admin User ──────────────────────────────
  const adminPassword = await bcrypt.hash("Admin123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@mmkaccountants.co.uk" },
    update: {},
    create: {
      email: "admin@mmkaccountants.co.uk",
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
      emailVerified: new Date(),
      isActive: true,
    },
  });

  console.log(`  Super Admin created: ${admin.email} (${admin.id})`);

  // ─── 2. Create Default Agreement Template ────────────────────
  const template = await prisma.agreementTemplate.upsert({
    where: { id: "default-template-v1" },
    update: {},
    create: {
      id: "default-template-v1",
      version: 1,
      isActive: true,
      contentHtml: `
<h1>Registered Office Service Agreement</h1>

<p><strong>Between:</strong> MMK Accountants ("the Provider")<br/>
<strong>And:</strong> {{companyName}} ("the Client")</p>

<h2>1. Service Description</h2>
<p>The Provider agrees to provide the Client with the use of their business address at Luton, United Kingdom as the registered office address for the Client's company ({{companyName}}, Company Registration Number: {{crn}}) with Companies House.</p>

<h2>2. Services Included</h2>
<ul>
  <li>Use of Provider's address as the official Companies House registered office address</li>
  <li>Receipt and notification of all statutory correspondence from Companies House and HMRC</li>
  <li>Mail notification within 2 working days of receipt</li>
  <li>Access to an online client dashboard for account management</li>
  <li>Digital agreement signing and secure document storage</li>
</ul>

<h2>3. Fees</h2>
<p>The annual fee for this service is <strong>&pound;75.00</strong> (seventy-five pounds), payable in advance. Payment may be made by credit/debit card or BACS Direct Debit.</p>

<h2>4. Term and Renewal</h2>
<p>This agreement is for a period of 12 months from the date of signing. The agreement will automatically renew for successive 12-month periods unless either party provides at least 30 days' written notice of termination prior to the renewal date.</p>

<h2>5. Client Obligations</h2>
<p>The Client agrees to:</p>
<ul>
  <li>Provide accurate and up-to-date information about the company and its directors</li>
  <li>Notify the Provider immediately of any changes to company details, directors, or contact information</li>
  <li>Ensure all fees are paid on time</li>
  <li>Not use the registered address for any unlawful purpose</li>
  <li>Comply with all applicable Companies House and HMRC requirements</li>
</ul>

<h2>6. Provider Obligations</h2>
<p>The Provider agrees to:</p>
<ul>
  <li>Maintain the registered office address and accept mail on behalf of the Client</li>
  <li>Notify the Client of any received correspondence within 2 working days</li>
  <li>Keep all client information secure and confidential</li>
  <li>Provide reasonable notice of any changes to the service</li>
</ul>

<h2>7. Termination</h2>
<p>Either party may terminate this agreement with 30 days' written notice. Upon termination, the Client must arrange for a new registered office address and update Companies House accordingly. The Provider will continue to accept and forward mail for a period of 3 months following termination.</p>

<h2>8. Data Protection</h2>
<p>The Provider will handle all personal data in accordance with the UK Data Protection Act 2018 and the UK GDPR. Client data will be processed only for the purposes of providing this service and will not be shared with third parties without the Client's consent.</p>

<h2>9. Limitation of Liability</h2>
<p>The Provider's liability under this agreement shall be limited to the annual fee paid by the Client. The Provider shall not be liable for any indirect, consequential, or special damages.</p>

<h2>10. Governing Law</h2>
<p>This agreement shall be governed by and construed in accordance with the laws of England and Wales.</p>

<p><em>By signing below, both parties agree to the terms and conditions outlined in this agreement.</em></p>
      `.trim(),
    },
  });

  console.log(`  Agreement Template created: v${template.version} (${template.id})`);

  // ─── 3. Create a test client user (for development) ──────────
  const clientPassword = await bcrypt.hash("Client123!", 12);

  const testClient = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      passwordHash: clientPassword,
      role: "CLIENT",
      emailVerified: new Date(),
      isActive: true,
    },
  });

  console.log(`  Test Client created: ${testClient.email} (${testClient.id})`);

  console.log("\nSeed complete!");
  console.log("\n--- Login Credentials ---");
  console.log("  Admin:  admin@mmkaccountants.co.uk / Admin123!");
  console.log("  Client: test@example.com / Client123!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
