import { ConnectedToDB } from "@/lib/db/ConnectToBD";
import User from "@/lib/models/StoreUser";
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized user", { status: 400 });
        };

        await ConnectedToDB();

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return new NextResponse("User not found", { status: 401 });
        };

        const { productId } = await req.json();

        if (!productId) {
            return new NextResponse("Product not found", { status: 400 });
        };

        const isLiked = user.wishlist.includes(productId);

        if (isLiked) {

            // DisLiked
            user.wishlist = user.wishlist.filter((id: string) => id !== productId)
        } else {
            //Liked
            user.wishlist.push(productId)
        }
        await user.save()
        return NextResponse.json(user, { status: 200 })

    } catch (error) {
        console.log("[Wishlist_POST]", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
export const dynamic = "force-dynamic";