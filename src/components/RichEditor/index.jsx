import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './index.scss';

export default function RichEditor(props) {
    const { data, handleChange, type, label } = props;

    const onChange = (e) => {
        handleChange(type, e);
    };
    return (
        <div className='RichEditor'>
            <div className='label'>{label}</div>
            <ReactQuill
                theme='snow'
                value={data}
                onChange={onChange}
                modules={{
                    toolbar: [[{ size: [] }], [{ color: [] }], ['bold', 'underline', 'strike', 'code'], ['link', 'image'], ['clean']],
                    clipboard: {
                        matchVisual: false,
                    },
                }}
            />
        </div>
    );
}
