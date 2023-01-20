import TodoItem from './TodoItem';

const TodoCollection = ({
  todos,
  onToggleDone,
  onSave,
  onDelete,
  onChangeMode,
}) => {
  return (
    <div>
      {todos.map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleDone={(id) => {
              onToggleDone?.(id);
            }}
            onChangeMode={({ id, isEdit }) => {
              onChangeMode?.({ id, isEdit });
            }}
            onSave={({ id, title }) => {
              onSave?.({ id, title });
            }}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};

export default TodoCollection;
