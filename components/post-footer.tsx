import ApplauseButton from "@/components/applause-button";
import ShareButtons from "@/components/share-buttons";

interface PostFooterProps {
    title: string,
    description: string,
    slug: string
}

export default function PostFooter({title, slug, description}:PostFooterProps) {
    return(
        <footer className="w-full flex flex-row justify-between mt-8 border-t py-2">
            <ApplauseButton slug={slug} />
            <ShareButtons
                title={title}
                description={description}
                slug={slug}
            />
        </footer>
    )
}