export class Goal {
  id: string | null = null;
  title: string | null = 'Title';
  description: string | null = 'Description';
  deadline: string | null = (new Date()).toISOString().substring(0, 10);
  get Deadline() {
    return this.deadline || '';
  }
  set Deadline(value: string) {
    this.deadline = value.substring(0, 10);
  }
  isPublic: boolean | null = null;
  parentId: string | null = null;
  order: number | null = null;
  createdAt: Date | null = null;
  level: number | null = null;
}
