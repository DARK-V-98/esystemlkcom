
"use client";

import { useState, useTransition, useMemo } from 'react';
import { updateUserRole, deleteUser, type ManagedUser, type UserRole } from './actions';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuthContext } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function UsersManagementClient({ initialUsers }: { initialUsers: ManagedUser[] }) {
  const { firestore } = useAuthContext();
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);
  const { toast } = useToast();
  const { user: currentUser } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm || 
                              user.displayName?.toLowerCase().includes(searchLower) ||
                              user.email?.toLowerCase().includes(searchLower);

        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleRoleChange = (uid: string, role: UserRole) => {
    startTransition(() => {
      updateUserRole(uid, role).then(result => {
        if (result.success) {
          setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role } : u));
        }
        toast({
          title: result.success ? 'Success' : 'Error',
          description: result.message,
          variant: result.success ? 'default' : 'destructive',
        });
      });
    });
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    startTransition(() => {
        deleteUser(userToDelete.uid).then(result => {
            if (result.success) {
                setUsers(prev => prev.filter(u => u.uid !== userToDelete.uid));
            }
            toast({
                title: result.success ? 'Success' : 'Error',
                description: result.message,
                variant: result.success ? 'default' : 'destructive',
            });
            setUserToDelete(null);
        });
    });
  };

  const renderSkeleton = () => (
    <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
    </div>
  );

  if (isLoading) {
      return (
        <Card className="bg-card border-border rounded-2xl shadow-lg p-6">
            {renderSkeleton()}
        </Card>
      );
  }

  return (
    <AlertDialog>
      <div className="space-y-8">
        <Card className="bg-card border-border rounded-2xl shadow-lg">
            <CardHeader>
                <CardTitle>Filter Users</CardTitle>
                <CardDescription>Search by name/email or filter by role.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-lg bg-background border-border focus:border-primary focus:ring-0"
                    />
                    <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | 'all')}>
                        <SelectTrigger className="w-full md:w-auto rounded-lg bg-background border-border focus:border-primary focus:ring-0">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-2xl shadow-lg">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                        <TableRow key={user.uid}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                                    <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{user.displayName}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                            <Select
                            value={user.role}
                            onValueChange={(value: UserRole) => handleRoleChange(user.uid, value)}
                            disabled={isPending || user.uid === currentUser?.uid}
                            >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="developer">Developer</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell className="text-right">
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    disabled={isPending || user.uid === currentUser?.uid}
                                    onClick={() => setUserToDelete(user)}
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </AlertDialogTrigger>
                        </TableCell>
                        </TableRow>
                    ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                            No users match your criteria.
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
        </Card>
      </div>

        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the user's data from your database.
                    The user will still exist in Firebase Authentication.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser} disabled={isPending}>
                    {isPending ? 'Deleting...' : 'Continue'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
}
