const transformCPF = text => {
    // Vamos transformar uma string text qualquer em uma string CPF
    // Uma string CPF deve ser do formato XXX.XXX.XXX-XX, em que X é um dígito
    // Para uma string qualquer, vamos primeiro analisar os dígitos dela em sequência
    // e guardemos uma string apenas com os dígitos na variável "digits"
    let digits = ''
    for (const c of text) {
        if (c >= '0' && c <= '9') {
            digits += c
        }
    }
    // Aqui digits contém apenas dígitos, vamos separá-los em grupos na variável "groups" a seguir
    const groups = [digits.substr(0, 3), digits.substr(3, 3), digits.substr(6, 3), digits.substr(9, 2)];
    // Agora, para uma string digits '01234567890123456', groups valerá
    // ['012', '345', '678', '90']
    // Note que os caracteres após 90 são ignorados, já que CPF possui um tamanho máximo
    // A partir dessa array podemos construir a string CPF no formato correto '012.345.678-90'
    // esse valor será guardado na variável "result"
    // Note que alguns groups podem ser a string vazia '', nesse caso, queremos adicionar
    // pontuação automática apenas se o próximo grupo é não vazio, por exemplo:
    // para grupos ['012', '67', '', ''] queremos '012.67'
    // para grupos ['012', '345', '', ''] queremos '012.345'
    // para grupos ['012', '345', '6', ''] queremos '012.345.6'
    let result = '';
    if (groups[0]) {
        result += groups[0];
        if (groups[1]) {
            result += '.' + groups[1];
            if (groups[2]) {
                result += '.' + groups[2];
                if (groups[3]) {
                    result += '-' + groups[3];
                }
            }
        }
    }
    return result;
}

const transformCEP = text => {
    // Bem parecido com transformCPF, veja os comentários dessa função
    // Poderia até generalizar pra formatos arbitrários, mas não vale a pena pra esse site
    let digits = ''
    for (const c of text) {
        if (c >= '0' && c <= '9') {
            digits += c
        }
    }
    const groups = [digits.substr(0, 5), digits.substr(5, 3)];
    let result = '';
    if (groups[0]) {
        result += groups[0];
        if (groups[1]) {
            result += '-' + groups[1];
        }
    }
    return result;
}

const getFormData = () => {
    const form = document.getElementById('id-formContainer');
    const inputs = form.getElementsByTagName('input');
    const data = {};
    const occupation = document.getElementById('id-occupation');
    data[occupation.name] = occupation.value;
    const objectives = document.getElementById('id-objectives');
    data[objectives.name] = objectives.value;
    for (const input of inputs) {
        data[input.name] = input.value;
    }
    return data;
}
/** Algumas funções dependem do DOM, então precisamos esperar ele carregar primeiro */
const runAfterLoad = () => {
    const cpfInput = document.getElementById('id-cpf');
    cpfInput.addEventListener('input', ev => {
        /** Vamos transformar o valor digitado no input em uma string no formato CPF
         * É BEM importante que transformCPF não adicione pontuação caso o próximo "grupo" de dígitos
         * seja vazio. Por exemplo, imagine que '012' é transformado em '012.'
         * Quando o texto for '012.' e o usuário apagar '.',
         * o próximo valor do input será '012', que será transformado em '012.'
         */
        cpfInput.value = transformCPF(ev.target.value);
    });
    const cepInput = document.getElementById('id-cep');
    cepInput.addEventListener('input', ev => {
        cepInput.value = transformCEP(ev.target.value);
    });

    const sendPhotoButton = document.getElementById('id-sendPhoto');
    const previewPhoto = document.getElementById('id-previewPhoto');
    sendPhotoButton.addEventListener('change', ev => {
        const file = ev.target.files[0];
        const reader = new FileReader();
        reader.onload = ev => {
            previewPhoto.src = ev.target.result;
        }
        reader.readAsDataURL(file);
    });
    const form = document.getElementById('id-formContainer');
    form.addEventListener('submit', ev => {
        ev.preventDefault();
        console.log(getFormData());
    });
}
document.addEventListener('DOMContentLoaded', runAfterLoad);
