'use client'

import { Button } from "../ui/button"
import { Input } from "../ui/input"

export default function ScraperInput() {
    return <form onSubmit={(e) => {
        e.preventDefault()
        window.location.href = "/auth"
    }}>
        <div className="flex w-full items-center space-x-2">
            <Input type="url" placeholder="URL" />
            <Button type="submit">Submit</Button>
        </div>
    </form>

}