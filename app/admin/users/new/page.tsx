// Fix the 404 error for users/new by ensuring the page exists

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Create New User</h3>
        <p className="text-sm text-muted-foreground">Add a new user to the system.</p>
      </div>

      {/* Your new user form here */}
    </div>
  )
}
