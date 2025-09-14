export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUsersAdmin } from '@/lib/firestore-admin';
import type { User } from '@/lib/types';

export default async function AdminUsersPage() {
  const users = await getUsersAdmin();
  
  const handleBanToggle = async (user: User) => {
    const isBanned = !user.isBanned;
    const result = await banUserAction(user.id, isBanned);
    if (result.success) {
      setUsers(users.map(u => u.id === user.id ? { ...u, isBanned } : u));
      toast({
        title: 'Success',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  };

  if (loading) {
    return <div>Loading users...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Here you can manage all the users on the DriveIO platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} className={user.isBanned ? 'bg-destructive/10' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.isHost ? 'secondary' : 'outline'}>{user.isHost ? 'Host' : 'Renter'}</Badge>
                    {user.isAdmin && <Badge className="ml-2">Admin</Badge>}
                  </TableCell>
                  <TableCell>
                    {user.isBanned ? (
                        <Badge variant="destructive">Banned</Badge>
                    ) : (
                        <Badge variant="default">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <form action={`/api/admin/users/${user.id}/ban`} method="post">
                        <input type="hidden" name="isBanned" value={(!user.isBanned).toString()} />
                        <Button variant={user.isBanned ? 'secondary' : 'destructive'} size="sm" type="submit">
                          {user.isBanned ? 'Unban' : 'Ban'}
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
