// --- 1. SELETORES DOS ELEMENTOS ---
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// --- 2. DADOS (A "FONTE DA VERDADE") ---
// Tenta carregar as tarefas do localStorage.
// Se não houver nada, começa com um array vazio.
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// --- 3. FUNÇÕES ---

/**
 * Salva o array 'tasks' atual no localStorage.
 * JSON.stringify converte o array de objetos em uma string.
 */
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Renderiza (desenha) a lista de tarefas inteira na tela.
 */
function renderTasks() {
    // Limpa a lista no HTML antes de desenhar de novo
    taskList.innerHTML = '';

    // Para cada objeto 'task' no nosso array 'tasks'
    tasks.forEach((task, index) => {
        // 1. Cria o elemento <li>
        const li = document.createElement('li');
        
        // 2. Adiciona a classe 'completed' se a tarefa estiver concluída
        if (task.completed) {
            li.classList.add('completed');
        }

        // 3. Cria o <span> para o texto da tarefa
        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        taskText.textContent = task.text;
        taskText.setAttribute('contenteditable', 'true'); // Permite editar o texto
        
        // 4. Cria o botão de deletar
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'X';

        // 5. Adiciona os elementos (texto e botão) dentro do <li>
        li.appendChild(taskText);
        li.appendChild(deleteBtn);

        // 6. Adiciona o <li> na lista (<ul>)
        taskList.appendChild(li);

        // --- ADICIONA OS EVENTOS ---

        // Evento para MARCAR COMO CONCLUÍDO (clicando no <li>)
        li.addEventListener('click', (e) => {
            // Só marca se o clique NÃO for no botão de deletar ou no texto (para edição)
            if (e.target !== deleteBtn && e.target !== taskText) {
                toggleCompleted(index);
            }
        });
        
        // Evento para EDITAR TAREFA
        taskText.addEventListener('blur', () => { // 'blur' = quando o usuário clica fora
            editTask(index, taskText.textContent);
        });
        
        // Evento para DELETAR TAREFA
        deleteBtn.addEventListener('click', () => {
            deleteTask(index);
        });
    });
}

/**
 * Adiciona uma nova tarefa
 */
function addTask(text) {
    if (text === '') return; // Não adiciona tarefas vazias

    // Cria o novo objeto da tarefa
    const newTask = {
        text: text,
        completed: false
    };

    // Adiciona o objeto ao nosso array
    tasks.push(newTask);
    
    // Salva e Renderiza
    saveTasks();
    renderTasks();
}

/**
 * Alterna o estado 'completed' de uma tarefa
 */
function toggleCompleted(index) {
    // Inverte o valor booleano (true vira false, false vira true)
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

/**
 * Edita o texto de uma tarefa
 */
function editTask(index, newText) {
    tasks[index].text = newText;
    saveTasks();
    // Não precisa renderizar tudo, mas é mais simples por enquanto
}

/**
 * Deleta uma tarefa do array
 */
function deleteTask(index) {
    // Cria um novo array sem o item do 'index'
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// --- 4. EVENT LISTENERS GLOBAIS ---

// Evento para o formulário (quando o usuário clica em "Adicionar" ou aperta Enter)
taskForm.addEventListener('submit', (e) => {
    // Impede que a página recarregue (comportamento padrão do form)
    e.preventDefault(); 
    
    const taskText = taskInput.value.trim(); // Pega o texto e remove espaços extras
    addTask(taskText);
    
    // Limpa o campo do input
    taskInput.value = '';
});

// --- 5. INICIALIZAÇÃO ---
// Renderiza as tarefas que já estavam salvas assim que a página carrega
renderTasks();
// A CHAVE "}" EXTRA QUE ESTAVA AQUI FOI REMOVIDA