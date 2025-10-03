// /api/clerk/webhook

import { db } from "@/server/db";

export const POST = async (req: Request) => {
    const { data } = await req.json();
    console.log('clerk webhook received', data)
    // Find primary email
    const primaryEmailId = data.primary_email_address_id;
    const emailObject = data.email_addresses?.find((e: any) => e.id === primaryEmailId);
    const emailAddress = emailObject?.email_address;

    // Skip user creation if email is missing
    if (!emailAddress) {
        console.warn("⚠️ No email found for user:", data.id);
        return new Response("Skipping user creation — no email", { status: 200 });
    }
    const firstName = data.first_name
    const lastName = data.last_name
    const imageUrl = data.image_url
    const id = data.id

    await db.user.create({
        data: {
            id: id,
            emailAddress: emailAddress,
            firstName: firstName,
            lastName: lastName,
            imageUrl: imageUrl,
        }
    })

    console.log('User created')

    return new Response('Webhook received', { status: 200 })
}